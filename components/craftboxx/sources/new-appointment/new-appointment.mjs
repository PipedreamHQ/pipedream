import common from "../common/polling.mjs";

export default {
  ...common,
  key: "craftboxx-new-appointment",
  name: "New Appointment",
  description: "Emit new event when a new appointment is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listAppointments;
    },
    getResourcesFnArgs() {
      return {
        params: {
          order_by: "created_at",
          order_direction: "desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Appointment: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
