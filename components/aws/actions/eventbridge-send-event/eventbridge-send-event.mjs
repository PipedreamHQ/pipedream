import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-eventbridge-send-event",
  name: "EventBridge - Send event to Event Bus",
  description: toSingleLineString(`
    Sends an event to an EventBridge event bus.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eventbridge/classes/puteventscommand.html)
  `),
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
    const params = {
      Entries: [
        {
          Detail: JSON.stringify(this.eventData),
          DetailType: Object.keys(this.eventData).join(" "),
          EventBusName: this.eventBusName,
          Source: "pipedream",
        },
      ],
    };

    const response = this.aws.eventBridgeSendEvent(this.region, params);
    $.export("$summary", `Sent event data to ${this.eventBusName} bridge`);
    return response;
  },
};
