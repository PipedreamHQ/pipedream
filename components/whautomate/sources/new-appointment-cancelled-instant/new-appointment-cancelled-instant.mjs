import whautomate from "../../whautomate.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "whautomate-new-appointment-cancelled-instant",
  name: "New Appointment Cancelled Instant",
  description: "Emit new event when an appointment is cancelled in Whautomate. [See the documentation](https://help.whautomate.com/product-guides/integrations/webhooks/appointments)",
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
    appointmentId: {
      propDefinition: [
        whautomate,
        "appointmentId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical cancelled appointment events
      const recentEvents = await this.whautomate._makeRequest({
        method: "GET",
        path: "/appointments/recent-cancelled",
        params: {
          limit: 50,
        },
      });
      for (const event of recentEvents) {
        this.$emit(event, {
          id: event.appointment.id,
          summary: `Cancelled appointment: ${event.appointment.id}`,
          ts: Date.parse(event.appointment.updatedAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.whautomate._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          event: "appointment_cancelled",
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.whautomate._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const signature = headers["x-whautomate-signature"];
    const rawBody = JSON.stringify(body);
    const secretKey = this.whautomate.$auth.oauth_access_token;

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const appointmentId = body.appointment.id;
    this.$emit(body, {
      id: appointmentId,
      summary: `Appointment cancelled: ${appointmentId}`,
      ts: Date.parse(body.appointment.updatedAt),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
