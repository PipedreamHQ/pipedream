import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "otter_waiver-new-check-in-instant",
  name: "New Check-In (Instant)",
  description: "Emit new event when a participant checks into an event.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "checkin";
    },
    getFunction() {
      return this.otterWaiver.getLatestCheckIns;
    },
    getSummary(checkIn) {
      return `New check-in: ${checkIn.id}`;
    },
  },
  sampleEmit,
};
