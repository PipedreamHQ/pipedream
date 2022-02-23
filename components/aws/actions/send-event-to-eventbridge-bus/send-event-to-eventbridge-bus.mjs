import aws from "../../aws.app.mjs";

export default {
  key: "aws-send-event-to-eventbridge-bus",
  name: "AWS - EventBridge - Send event to Event Bus",
  description: "Sends an event to an EventBridge event bus. [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eventbridge/classes/puteventscommand.html)",
  version: "0.3.2",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "Region tied to your EventBridge event bus, e.g. us-east-1 or us-west-2",
    },
    eventBusName: {
      propDefinition: [
        aws,
        "eventBusName",
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
    const response = this.aws.sendToEventBridgeBus(
      this.region,
      this.eventBusName,
      this.eventData,
    );
    $.export("$summary", `Sent event data to ${this.eventBusName} bridge`);
    return response;
  },
};
