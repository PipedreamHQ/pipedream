import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "humanitix-new-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created in Humanitix. [See the documentation](https://humanitix.stoplight.io/docs/humanitix-public-api/476881e4b5d55-get-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.humanitix.getEvents;
    },
    getSummary(item) {
      return `New Event: ${item._id}`;
    },
    getDataField() {
      return "events";
    },
  },
  sampleEmit,
};
