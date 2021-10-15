const { v4: uuid } = require("uuid");
const aws = require("../../aws.app.js");
const base = require("../common/ses");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  ...base,
  type: "source",
  key: "aws-new-emails-sent-to-ses-catch-all-domain",
  name: "New SES Catch-All Email Sent",
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
      propDefinition: [
        aws,
        "domain",
      ],
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
