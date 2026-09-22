import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "evenium-new-event",
  name: "New Event",
  description: "Emit new event when a new event is created. [See the documentation](https://static.evenium.com/api-docs/organizer/index-json.html#_get_all_events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFields() {
      return {
        data: "events",
        filter: "createdAfter",
        date: "creationDate",
        id: "id",
      };
    },
    getSummary(result) {
      return `New Event: ${result.title}`;
    },
    getFunction() {
      return this.evenium.listEvents;
    },
  },
  sampleEmit,
};

