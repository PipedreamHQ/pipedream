const aws = require("https://github.com/PipedreamHQ/pipedream/components/aws/aws.app.js");
const axios = require("axios");

module.exports = {
  name: "New Emails sent to SES Catch-all Domain",
  description:
    "The source subscribes to all emails delivered to a specific domain configured in AWS SES. When an email is sent to any address at the domain, this event source emits that email as a formatted event. These events can trigger a Pipedream workflow and can be consumed via SSE or REST API.",
  version: "0.2.2",
  props: {
    region: {
      label: "AWS Region",
      description: "The AWS region string where you configured your SES domain",
      type: "string",
      default: "us-east-1",
    },
    aws,
    http: "$.interface.http",
    db: "$.service.db",
    domain: {
      label: "SES Domain",
      description: "The domain you'd like to configure a catch-all handler for",
      type: "string",
      async options() {
        return this.aws.sesIdentities(this.region);
      },
    },
  },
  hooks: {
    async activate() {
      const AWS = this.aws.sdk(this.region);
      const sns = new AWS.SNS();
      const ses = new AWS.SES();
      this.topic = `SES-${this.domain}-pipedream`.replace(
        RegExp("[^A-Za-z0-9_-]", "g"),
        "_"
      );
      const topic = await sns.createTopic({ Name: this.topic }).promise();
      this.db.set("topic_arn", topic.TopicArn);
      console.log("setting up ruleset");
      const ruleset = await ses.describeActiveReceiptRuleSet().promise();
      let After = undefined;
      if (ruleset.Rules && ruleset.Rules.length > 0) {
        After = ruleset.Rules[ruleset.Rules.length - 1].Name;
      }
      console.log(
        await ses
          .createReceiptRule({
            RuleSetName: ruleset.Metadata.Name,
            After,
            Rule: {
              Name: `${this.domain}-catchall-pipedream`,
              Enabled: true,
              Actions: [{ SNSAction: { TopicArn: topic.TopicArn } }],
              Recipients: [this.domain],
              ScanEnabled: true,
            },
          })
          .promise()
      );
      this.db.set("ses-rule", {
        RuleName: `${this.domain}-catchall-pipedream`,
        RuleSetName: ruleset.Metadata.Name,
      });
      console.log("subscribing myself to SNS");
      console.log(
        await sns
          .subscribe({
            TopicArn: topic.TopicArn,
            Protocol: "https",
            Endpoint: this.http.endpoint,
          })
          .promise()
      );
    },
    async deactivate() {
      const AWS = this.aws.sdk(this.region);
      const sns = new AWS.SNS();
      const ses = new AWS.SES();
      try {
        console.log(
          await ses.deleteReceiptRule(this.db.get("ses-rule")).promise()
        );
      } catch (err) {
        console.error(err);
      }
      console.log(
        await sns.deleteTopic({ TopicArn: this.db.get("topic_arn") }).promise()
      );
    },
  },
  async run(event) {
    if (event.body.Type === "SubscriptionConfirmation") {
      console.log("confirming subscription");
      console.log(await axios({ url: event.body.SubscribeURL }));
    } else {
      this.$emit(JSON.parse(event.body.Message));
    }
  },
};
