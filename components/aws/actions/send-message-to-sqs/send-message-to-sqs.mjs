// legacy_hash_id: a_67il7K
import AWS from "aws-sdk";

export default {
  key: "aws-send-message-to-sqs",
  name: "AWS - SQS - Send Message",
  description: "Sends a message to an SQS queue",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    region: {
      type: "string",
      label: "AWS Region",
      description: "The AWS region tied to your SQS queue, e.g us-east-1 or us-west-2",
    },
    QueueUrl: {
      type: "string",
      label: "SQS Queue URL",
    },
    eventData: {
      type: "string",
      label: "Event data",
      description: "A variable reference to the event data you want to send to the event bus (e.g. event.body)",
    },
  },
  async run({ $ }) {
    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;
    const {
      region,
      QueueUrl,
      eventData,
    } = this;

    const sqs = new AWS.SQS({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // This sends the payload to the SQS queue, and assumes the payload is JSON.
    // Please modify the code accordingly if your data is in a different format
    const sqsParams = {
      MessageBody: JSON.stringify(eventData),
      QueueUrl,
    };

    $.export("res", await sqs.sendMessage(sqsParams).promise());
  },
};
