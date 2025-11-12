import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cliniko-new-appointment-updated",
  name: "New Appointment Updated",
  description: "Emit new event when an appointment is updated in Cliniko.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "appointments";
    },
    getResourcesFn() {
      return this.app.listAppointments;
    },
    generateMeta(resource) {
      return {
        id: `${resource.id}-${resource.updated_at}`,
        summary: `Appointment updated: ${resource.id}`,
        ts: Date.parse(resource.updated_at),
      };
    },
    getSort() {
      return "updated_at:desc";
    },
  },
  sampleEmit,
};
