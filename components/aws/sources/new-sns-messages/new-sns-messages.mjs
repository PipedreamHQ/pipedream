import base from "../common/sns.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...base,
  key: "aws-new-sns-messages",
  name: "New SNS Messages",
  description: toSingleLineString(`
    Creates an SNS topic in your AWS account.
    Messages published to this topic are emitted from the Pipedream source.
  `),
  version: "0.3.0",
  type: "source",
  dedupe: "unique", // Dedupe on SNS message ID
  props: {
    ...base.props,
    topic: {
      label: "SNS Topic Name",
      description: toSingleLineString(`
        **Pipedream will create an SNS topic with this name in your account**,
        converting it to a [valid SNS topic
        name](https://docs.aws.amazon.com/sns/latest/api/API_CreateTopic.html).
      `),
      type: "string",
    },
  },
  methods: {
    ...base.methods,
    getTopicName() {
      return this.convertNameToValidSNSTopicName(this.topic);
    },
  },
};
