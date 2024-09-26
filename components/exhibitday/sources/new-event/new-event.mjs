import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "exhibitday-new-event",
  name: "New Event",
  description: "Emit new event when an event is created in ExhibitDay",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.exhibitday.listEvents;
    },
    getTsField() {
      return "event_created_timestamp";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Event - ${event.name}`,
        ts: Date.parse(event[this.getTsField()]),
      };
    },
  },
  sampleEmit,
};
