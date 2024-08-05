import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whautomate-new-appointment-cancelled-instant",
  name: "New Appointment Cancelled (Instant)",
  description: "Emit new event when an appointment is cancelled in Whautomate.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "appointment_cancelled",
      ];
    },
    getSummary(body) {
      return `Appointment cancelled: ${body.appointment.id}`;
    },
  },
  sampleEmit,
};
