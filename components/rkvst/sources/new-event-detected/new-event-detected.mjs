import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rkvst-new-event-detected",
  name: "New Event Detected",
  description: "Emit new event for each new activity related to any asset within the platform.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    assetId: {
      propDefinition: [
        common.props.rkvst,
        "assetId",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: event.identity,
        summary: `New Event: ${event.operation}`,
        ts: Date.parse(event.timestamp_declared),
      };
    },
    getParams() {
      return {
        fn: this.rkvst.listEvents,
        assetId: this.assetId,
        dataField: "events",
      };
    },
    getTimeField() {
      return "timestamp_declared";
    },
  },
  sampleEmit,
};
