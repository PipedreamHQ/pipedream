import base from "../common/sns.mjs";
import { toSingleLineString } from "../../common/utils.mjs";
import commonSNS from "../../common/common-sns.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...base,
  key: "aws-new-sns-messages",
  name: "New SNS Messages",
  description: toSingleLineString(`
    Creates an SNS topic in your AWS account.
    Messages published to this topic are emitted from the Pipedream source.
  `),
  version: "0.4.4",
  type: "source",
  dedupe: "unique", // Dedupe on SNS message ID
  props: {
    ...base.props,
    topicArn: {
      ...commonSNS.props.topic,
      optional: true,
    },
    topic: {
      label: "SNS Topic Name",
      description: toSingleLineString(`
        **Pipedream will create an SNS topic with this name in your account**,
        converting it to a [valid SNS topic
        name](https://docs.aws.amazon.com/sns/latest/api/API_CreateTopic.html).
      `),
      type: "string",
      optional: true,
    },
  },
  methods: {
    ...base.methods,
    getTopicName() {
      return this.convertNameToValidSNSTopicName(this.topic);
    },
  },
  async run(event) {
    if (!this.topicArn && !this.topic) {
      throw new ConfigurationError("Must specify either an existing topic or a new topic name");
    }

    if (this._isSubscriptionConfirmationEvent(event)) {
      const { body } = event;
      const subscriptionArn = await this._confirmSubscription(body);
      this._setSubscriptionArn(subscriptionArn);
      return;
    }

    await this.processEvent(event);
  },
};
