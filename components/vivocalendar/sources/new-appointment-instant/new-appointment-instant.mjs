import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "vivocalendar-new-appointment-instant",
  name: "New Appointment (Instant)",
  description: "Emit new event when a new appointment is created. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return events.APPOINTMENT_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Appointment: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
