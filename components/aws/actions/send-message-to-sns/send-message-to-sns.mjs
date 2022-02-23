import aws from "../../aws.app.mjs";

export default {
  key: "aws-send-message-to-sns",
  name: "AWS - SNS - Send Message",
  description: "Sends a message to a SNS Topic. [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html)",
  version: "0.0.1",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "Region tied to your SNS Topic, e.g. us-east-1 or us-west-2",
    },
    topic: {
      propDefinition: [
        aws,
        "topic",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent",
    },
  },
  async run({ $ }) {
    const response = this.aws.sendMessageToSns(
      this.region,
      this.topic,
      this.message,
    );
    $.export("$summary", `Sent message to ${this.topic} SNS`);
    return response;
  },
};
