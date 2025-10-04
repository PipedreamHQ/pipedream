import aws from "../../aws.app.mjs";
import common from "../../common/common-sqs.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-sqs-send-message",
  name: "SQS - Send Message",
  description: toSingleLineString(`
    Sends a message to an SQS queue.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/classes/sendmessagecommand.html)
  `),
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    queueUrl: common.props.queueUrl,
    eventData: {
      propDefinition: [
        aws,
        "eventData",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.sqsSendMessage({
      MessageBody: JSON.stringify(this.eventData),
      QueueUrl: this.queueUrl,
    });
    $.export("$summary", `Sent message to ${this.queueUrl}`);
    return response;
  },
};
