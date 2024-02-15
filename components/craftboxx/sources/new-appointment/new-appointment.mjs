import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-new-appointment",
  name: "New Appointment",
  description: "Emits an event when a new appointment is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    craftboxx,
    db: "$.service.db",
    projectId: {
      propDefinition: [
        craftboxx,
        "projectId",
      ],
    },
    customerId: {
      propDefinition: [
        craftboxx,
        "customerId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Initialize state
      this.db.set("lastCheck", new Date().toISOString());
    },
  },
  methods: {
    ...craftboxx.methods,
    generateMeta(appointment) {
      const meta = {
        id: appointment.id,
        summary: `New appointment created for project ${appointment.projectId}`,
        ts: Date.parse(appointment.createdAt),
      };
      return meta;
    },
  },
  async run() {
    const lastCheck = this.db.get("lastCheck");
    const newAppointments = await this.craftboxx._makeRequest({
      method: "GET",
      path: "/assignments",
      params: {
        createdAt_gte: lastCheck,
        projectId: this.projectId,
        customerId: this.customerId,
      },
    });

    for (const appointment of newAppointments) {
      this.$emit(appointment, this.generateMeta(appointment));
    }

    this.db.set("lastCheck", new Date().toISOString());
  },
};
