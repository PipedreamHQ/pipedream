// legacy_hash_id: a_Q3i5WQ
import AWS from "aws-sdk";

export default {
  key: "aws-send-event-to-eventbridge-bus",
  name: "AWS - EventBridge - Send event to Event Bus",
  description: "Sends an event to an EventBridge event bus",
  version: "0.3.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    region: {
      type: "string",
      label: "AWS Region",
      description: "Region tied to your EventBridge event bus, e.g. us-east-1 or us-west-2",
    },
    EventBusName: {
      type: "string",
      label: "Event Bus Name",
      description: "The name of the EventBridge event bus",
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
      EventBusName,
      eventData,
    } = this;

    const eventbridge = new AWS.EventBridge({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // See https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#putEvents-property
    const putEventsParams = {
      Entries: [
        {
          Detail: JSON.stringify(eventData),
          DetailType: Object.keys(eventData).join(" "),
          EventBusName,
          Source: "pipedream",
        },
      ],
    };

    $.export("res", await eventbridge.putEvents(putEventsParams).promise());
  },
};
