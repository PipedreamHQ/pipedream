const { v4: uuid } = require("uuid");
const base = require("../common/ses");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  ...base,
  key: "aws-new-emails-sent-to-ses-catch-all-domain",
  name: "New Emails sent to SES Catch-all Domain",
  description: toSingleLineString(`
    The source subscribes to all emails delivered to a
    specific domain configured in AWS SES.
    When an email is sent to any address at the domain,
    this event source emits that email as a formatted event.
    These events can trigger a Pipedream workflow and can be consumed via SSE or REST API.
  `),
  version: "0.3.0",
  props: {
    ...base.props,
    domain: {
      label: "SES Domain",
      description: "The domain you'd like to configure a catch-all handler for",
      type: "string",
      options() {
        return this.sesIdentities();
      },
    },
  },
  methods: {
    ...base.methods,
    getReceiptRule(topicArn) {
      const name = `pd-${this.domain}-catchall-${uuid()}`;
      const rule = {
        Name: name,
        Enabled: true,
        Actions: [
          {
            SNSAction: {
              TopicArn: topicArn,
            },
          },
        ],
        Recipients: [
          this.domain,
        ],
        ScanEnabled: true,
      };
      return {
        name,
        rule,
      };
    },
  },
};
