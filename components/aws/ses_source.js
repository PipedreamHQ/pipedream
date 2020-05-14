const aws = {
  type: "app",
  app: "aws",
  methods: {
    sdk(region) {
      process.env.AWS_ACCESS_KEY_ID = this.$auth.accessKeyId
      process.env.AWS_SECRET_ACCESS_KEY = this.$auth.secretAccessKey
      const AWS = require("aws-sdk")
      AWS.config.update({ region })
      return AWS
    },
    async sesIdentities(region) {
      const AWS = this.sdk(region)
      const ses = new AWS.SES()
      return (await ses.listIdentities().promise()).Identities
    }
  }
}

const got = require('got')
module.exports = {
  name: "ses-source",
  version: "0.2.0",
  props: {
    region: {
      type: "string",
      default: "us-east-1",
    },
    aws,
    http: "$.interface.http",
    db: "$.service.db",
    domain: {
      type: "string",
      async options() {
        return this.aws.sesIdentities(this.region)
      }
    }
  },
  hooks: {
    async activate() {
      const AWS = this.aws.sdk(this.region)
      const sns = new AWS.SNS()
      const ses = new AWS.SES()
      this.topic = `SES-${this.domain}-pipedream`.replace(RegExp('[^A-Za-z0-9_-]', 'g'), '_')
      const topic = await sns.createTopic({Name: this.topic}).promise()
      this.db.set("topic_arn", topic.TopicArn)
      console.log("setting up ruleset")
      const ruleset = await ses.describeActiveReceiptRuleSet().promise()
      let After = ""
      if (ruleset.Rules.length > 0) {
        After = ruleset.Rules[ruleset.Rules.length - 1].Name
      }
      console.log(await ses.createReceiptRule({
        RuleSetName: ruleset.Metadata.Name,
        After,
        Rule: {
          Name: `${this.domain}-catchall-pipedream`,
          Enabled: true,
          Actions: [ {SNSAction: { TopicArn: topic.TopicArn } } ],
          Recipients: [this.domain],
          ScanEnabled: true
        }
      }).promise())
      this.db.set("ses-rule", {
        RuleName: `${this.domain}-catchall-pipedream`,
        RuleSetName: ruleset.Metadata.Name
      })
      console.log("subscribing myself to SNS")
      console.log(await sns.subscribe({
        TopicArn: topic.TopicArn,
        Protocol: "https",
        Endpoint: this.http.endpoint
      }).promise())
    },
    async deactivate() {
      const AWS = this.aws.sdk(this.region)
      const sns = new AWS.SNS()
      const ses = new AWS.SES()
      try {
        console.log(await ses.deleteReceiptRule(this.db.get("ses-rule")).promise())
      } catch (err) {
        console.error(err)
      }
      console.log(await sns.deleteTopic({TopicArn: this.db.get("topic_arn")}).promise())
    }
  },
  async run(event) {
    if(event.body.Type == "SubscriptionConfirmation") {
      console.log("confirming subscription")
      console.log(await got(event.body.SubscribeURL))
    } else {
      this.$emit(JSON.parse(event.body.Message))
    }
  }
}
