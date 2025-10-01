import common from "../../common/common-sns.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-sns-send-message",
  name: "SNS - Send Message",
  description: toSingleLineString(`
    Sends a message to a SNS Topic.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html)
  `),
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    topic: common.props.topic,
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent",
    },
  },
  async run({ $ }) {
    const response = this.snsSendMessage({
      TopicArn: this.topic,
      Message: this.message,
    });
    $.export("$summary", `Sent message to ${this.topic} SNS`);
    return response;
  },
};
