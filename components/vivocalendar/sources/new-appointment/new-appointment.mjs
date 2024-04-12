import { axios } from "@pipedream/platform";
import vivocalendar from "../../vivocalendar.app.mjs";
import crypto from "crypto";

export default {
  key: "vivocalendar-new-appointment",
  name: "New Appointment",
  description: "Emit a new event when a new appointment is created. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vivocalendar,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    staffMemberId: {
      propDefinition: [
        vivocalendar,
        "staffMemberId",
      ],
    },
    customerId: {
      propDefinition: [
        vivocalendar,
        "customerId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 appointments, if possible, or as many as available
      const appointments = await this.vivocalendar.getRecentAppointments({
        staffMemberId: this.staffMemberId,
        customerId: this.customerId,
        max: 50,
      });
      for (const appointment of appointments) {
        this.$emit(appointment, {
          id: appointment.appointmentId,
          summary: `New appointment for customer ${appointment.customerId} with staff ${appointment.staffMemberId}`,
          ts: Date.parse(appointment.appointmentDate),
        });
      }
    },
    async activate() {
      const webhookId = await this.vivocalendar.createWebhook({
        endpoint: this.http.endpoint,
        event: "new_appointment",
        staffMemberId: this.staffMemberId,
        customerId: this.customerId,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.vivocalendar.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const signatureHeader = event.headers["x-signature"];
    const secretKey = this.vivocalendar.$auth.oauth_access_token;
    const computedSignature = crypto.createHmac("sha256", secretKey).update(JSON.stringify(event.body))
      .digest("hex");

    if (signatureHeader !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const appointment = event.body;

    this.$emit(appointment, {
      id: appointment.appointmentId,
      summary: `New appointment for customer ${appointment.customerId} with staff ${appointment.staffMemberId}`,
      ts: Date.parse(appointment.appointmentDate),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
