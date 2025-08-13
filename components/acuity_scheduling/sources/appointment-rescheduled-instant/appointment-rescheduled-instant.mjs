import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "acuity_scheduling-appointment-rescheduled-instant",
  name: "New Appointment Rescheduled (Instant)",
  description: "Emit new event when an appointment is rescheduled.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getEvent() {
      return "appointment.rescheduled";
    },
    getSummary(details) {
      return `New appointment rescheduled with Id: ${details.id}`;
    },
  },
  sampleEmit,
};
