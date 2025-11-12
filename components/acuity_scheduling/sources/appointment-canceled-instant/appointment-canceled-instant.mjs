import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "acuity_scheduling-appointment-canceled-instant",
  name: "New Appointment Canceled (Instant)",
  description: "Emit new event when an appointment is canceled.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "appointment.canceled";
    },
    getSummary(details) {
      return `New appointment canceled with Id: ${details.id}`;
    },
  },
  sampleEmit,
};
