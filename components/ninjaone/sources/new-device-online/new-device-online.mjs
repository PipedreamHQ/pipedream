import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ninjaone-new-device-online",
  name: "New Device Online",
  description: "Emit new event when a monitored device comes online.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getParams() {
      return {
        class: "DEVICE",
      };
    },
    filterEvents(events) {
      return events.filter((item) => item.statusCode === "SYSTEM_REBOOTED");
    },
    getSummary(item) {
      return `Device online: ${item.deviceId}`;
    },
  },
  sampleEmit,
};
