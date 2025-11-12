import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "acuity_scheduling-appointment-rescheduled-instant",
  name: "New Appointment Rescheduled (Instant)",
  description: "Emit new event when an appointment is rescheduled.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "appointment.rescheduled";
    },
    getSummary(details) {
      return `Appointment rescheduled with ID: ${details.id}`;
    },
    generateMeta(details) {
      const ts = Date.parse(details.datetime) || Date.now();
      return {
        id: `${details.id}-${ts}`,
        summary: this.getSummary(details),
        ts,
      };
    },
  },
  sampleEmit,
};
