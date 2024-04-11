import acuityScheduling from "../../acuity_scheduling.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acuity_scheduling-new-appointment-instant",
  name: "New Appointment Instant",
  description: "Emit new event when an appointment is scheduled.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    acuityScheduling,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      // Create a webhook for appointment.scheduled event
      const data = {
        event: "appointment.scheduled",
        target: this.http.endpoint,
      };
      const response = await this.acuityScheduling._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      this.db.set("webhookId", response.id); // Assuming response.id is the correct ID
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.acuityScheduling._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (!body || !body.id) {
      this.http.respond({
        status: 400,
        body: "No data received or appointment ID missing",
      });
      return;
    }

    const appointmentDetails = await this.acuityScheduling.getAppointments({
      id: body.id,
    });

    if (appointmentDetails) {
      this.$emit(appointmentDetails, {
        id: appointmentDetails.id.toString(),
        summary: `New appointment scheduled: ${appointmentDetails.type}`,
        ts: Date.parse(appointmentDetails.time),
      });

      this.http.respond({
        status: 200,
        body: "Success",
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Appointment details not found",
      });
    }
  },
};
