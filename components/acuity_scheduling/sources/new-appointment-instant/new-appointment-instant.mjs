import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "acuity_scheduling-new-appointment-instant",
  name: "New Appointment (Instant)",
  description: "Emit new event when an appointment is scheduled.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "appointment.scheduled";
    },
    getSummary(details) {
      return `New appointment scheduled with Id: ${details.id}`;
    },
  },
  sampleEmit,
};
