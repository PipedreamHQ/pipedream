import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "otter_waiver-new-signee-instant",
  name: "New Signee (Instant)",
  description: "Emit new event when a new signee is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "new_signee";
    },
    getFunction() {
      return this.otterWaiver.getLatestParticipants;
    },
    getSummary(checkIn) {
      return `New signee: ${checkIn.id}`;
    },
  },
  sampleEmit,
};
