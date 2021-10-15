const aws = require("../../aws.app.js");
const base = require("../common/sns");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  ...base,
  type: "source",
  key: "aws-new-sns-messages",
  name: "New SNS Messages",
  description: toSingleLineString(`
    Creates an SNS topic in your AWS account.
    Messages published to this topic are emitted from the Pipedream source.
  `),
  version: "0.1.0",
  dedupe: "unique", // Dedupe on SNS message ID
  props: {
    ...base.props,
    topic: {
      propDefinition: [
        aws,
        "topic",
      ],
    },
  },
  methods: {
    ...base.methods,
    getTopicName() {
      return this.convertNameToValidSNSTopicName(this.topic);
    },
  },
};
