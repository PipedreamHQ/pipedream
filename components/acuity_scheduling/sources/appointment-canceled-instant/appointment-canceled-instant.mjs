import acuityScheduling from "../../acuity_scheduling.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acuity_scheduling-appointment-canceled-instant",
  name: "Appointment Canceled (Instant)",
  description: "Emit new event when an appointment is canceled.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    acuityScheduling: {
      type: "app",
      app: "acuity_scheduling",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent canceled appointments to emit on first run
      const appointments = await this.acuityScheduling.getAppointments({
        status: "canceled",
      }).slice(0, 50);
      appointments.forEach((appointment) => {
        this.$emit(appointment, {
          id: appointment.id,
          summary: `Appointment ${appointment.id} canceled`,
          ts: Date.parse(appointment.canceled),
        });
      });
    },
    async activate() {
      // Create a webhook for canceled appointments
      const { data } = await axios(this, {
        method: "POST",
        url: `${this.acuityScheduling._baseUrl()}/webhooks`,
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.acuityScheduling.$auth.acuity_user_id}:${this.acuityScheduling.$auth.acuity_api_key}`).toString("base64")}`,
        },
        data: {
          event: "appointment.canceled",
          target: this.http.endpoint,
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      // Delete the webhook
      const webhookId = this.db.get("webhookId");
      await axios(this, {
        method: "DELETE",
        url: `${this.acuityScheduling._baseUrl()}/webhooks/${webhookId}`,
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.acuityScheduling.$auth.acuity_user_id}:${this.acuityScheduling.$auth.acuity_api_key}`).toString("base64")}`,
        },
      });
    },
  },
  async run(event) {
    // Assuming event.body is the appointment data
    const appointment = event.body;
    this.$emit(appointment, {
      id: appointment.id,
      summary: `Appointment ${appointment.id} canceled`,
      ts: Date.parse(appointment.canceled),
    });
  },
};
