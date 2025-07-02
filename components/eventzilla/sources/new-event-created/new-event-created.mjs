import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "eventzilla-new-event-created",
  name: "New Event Created",
  description: "Emit new event when a new event is created in Eventzilla. [See the documentation](https://developer.eventzilla.net/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.eventzilla.listEvents;
    },
    getResourceKey() {
      return "events";
    },
    getSummary(item) {
      return `New Event ID: ${item.id}`;
    },
  },
  sampleEmit,
};
