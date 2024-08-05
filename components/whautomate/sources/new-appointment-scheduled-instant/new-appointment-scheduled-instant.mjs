import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whautomate-new-appointment-scheduled-instant",
  name: "New Appointment Scheduled (Instant)",
  description: "Emit new event when a new appointment is scheduled in Whautomate.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "appointment_scheduled",
      ];
    },
    getSummary(body) {
      return `New appointment scheduled for client ${body.appointment.client.fullName}`;
    },
  },
  sampleEmit,
};
