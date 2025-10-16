import aws from "../../aws.app.mjs";
import common from "../../common/common-eventbridge.mjs";

export default {
  ...common,
  key: "aws-eventbridge-send-event",
  name: "EventBridge - Send Event to Event Bus",
  description: "Sends an event to an EventBridge event bus. [See documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/eventbridge/command/PutEventsCommand/)",
  version: "0.4.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    detailType: {
      type: "string",
      label: "Detail Type",
      description: "Free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail. Detail, DetailType, and Source are required for EventBridge to successfully send an event to an event bus. If you include event entries in a request that does not include each of those properties, EventBridge fails that entry. If you submit a request in which none of the entries have each of these properties, EventBridge fails the entire request.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      Entries: [
        {
          Detail: JSON.stringify(this.eventData),
          DetailType: this.detailType || Object.keys(this.eventData).join(" "),
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
