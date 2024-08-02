import whautomate from "../../whautomate.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-new-appointment-scheduled-instant",
  name: "New Appointment Scheduled",
  description: "Emit new event when a new appointment is scheduled in Whautomate. [See the documentation](https://help.whautomate.com/product-guides/integrations/webhooks/appointments)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whautomate: {
      type: "app",
      app: "whautomate",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      // No historical data to fetch for appointments
    },
    async activate() {
      const response = await this.whautomate._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          events: [
            "appointment_updates",
          ],
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.whautomate._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const computedSignature = crypto.createHmac("sha256", this.whautomate.$auth.oauth_access_token)
      .update(event.body)
      .digest("base64");

    if (computedSignature !== event.headers["x-whautomate-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const appointment = event.body.appointment;
    const notificationPref = appointment.notificationPref || null;

    this.$emit(
      {
        appointmentDate: appointment.date,
        clientId: appointment.client.id,
        notificationPref,
      },
      {
        id: appointment.id,
        summary: `New appointment scheduled for client ${appointment.client.id}`,
        ts: Date.parse(appointment.createdAt),
      },
    );

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
