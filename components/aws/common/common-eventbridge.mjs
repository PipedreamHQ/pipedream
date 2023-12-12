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
      description: "Region tied to your EventBridge event bus, e.g. `us-east-1` or `us-west-2`",
    },
    eventBusName: {
      type: "string",
      label: "Event Bus Name",
      description: "The name of the EventBridge event bus",
      async options({ prevContext }) {
        const response = await this.eventBridgeListEventBuses({
          NextToken: prevContext.nextToken,
        });
        return {
          options: response.EventBuses.map((eventBus) => eventBus.Name),
          context: {
            nextToken: response.NextToken,
          },
        };
      },
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
