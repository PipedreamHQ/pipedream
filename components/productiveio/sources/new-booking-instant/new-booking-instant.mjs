import productiveio from "../../productiveio.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "productiveio-new-booking-instant",
  name: "New Booking (Instant)",
  description: "Emit new event when a new booking is created. [See the documentation](https://developer.productive.io/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    productiveio,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.productiveio.createWebhook({
        type: "bookings",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.productiveio.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Signature validation is not provided in the example, but should be implemented here if applicable

    this.$emit(body, {
      id: body.data.id,
      summary: `New booking created: ${body.data.attributes.name}`,
      ts: Date.parse(body.data.attributes.created_at),
    });

    this.http.respond({
      status: 200,
    });
  },
};
