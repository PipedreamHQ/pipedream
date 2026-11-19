import aws from "../aws.app.mjs";
import {
  EventBridgeClient,
  ListEventBusesCommand,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "Region tied to your EventBridge event bus, e.g. `us-east-1` or `us-west-2`. Run **List AWS Region Options** to see the available regions.",
    },
    eventBusName: {
      type: "string",
      label: "Event Bus Name",
      description: "The name of the EventBridge event bus, e.g. `default`. Run **EventBridge - List Event Buses** to find event bus names.",
    },
  },
  methods: {
    _clientEventbridge() {
      return this.aws.getAWSClient(EventBridgeClient, this.region);
    },
    async eventBridgeListEventBuses(params) {
      return this._clientEventbridge().send(new ListEventBusesCommand(params));
    },
    async eventBridgeSendEvent(params) {
      return this._clientEventbridge().send(new PutEventsCommand(params));
    },
  },
};
