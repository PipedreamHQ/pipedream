import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-sqs-send-message",
  name: "SQS - Send Message",
  description: toSingleLineString(`
    Sends a message to an SQS queue.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/classes/sendmessagecommand.html)
  `),
  version: "0.1.2",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your SQS queue, e.g `us-east-1` or `us-west-2`",
    },
    queueUrl: {
      propDefinition: [
        aws,
        "queueUrl",
      ],
    },
    eventData: {
      propDefinition: [
        aws,
        "eventData",
      ],
    },
  },
  async run({ $ }) {
    const response = this.aws.sqsSendMessage(this.region, {
      MessageBody: JSON.stringify(this.eventData),
      QueueUrl: this.queueUrl,
    });
    $.export("$summary", `Sent message to ${this.queueUrl}`);
    return response;
  },
};
