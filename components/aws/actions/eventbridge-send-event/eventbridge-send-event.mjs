import aws from "../../aws.app.mjs";
import common from "../../common/common-eventbridge.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-eventbridge-send-event",
  name: "EventBridge - Send event to Event Bus",
  description: toSingleLineString(`
    Sends an event to an EventBridge event bus.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-eventbridge/classes/puteventscommand.html)
  `),
  version: "0.4.0",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    eventBusName: common.props.eventBusName,
    eventData: {
      propDefinition: [
        aws,
        "eventData",
      ],
      optional: false,
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

    const response = await this.eventBridgeSendEvent(params);
    $.export("$summary", `Sent event data to ${this.eventBusName} bridge`);
    return response;
  },
};
