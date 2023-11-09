import productiveio from "../../productiveio.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "productiveio-new-deal-instant",
  name: "New Deal (Instant)",
  description: "Emit new event when a new deal is created. [See the documentation](https://developer.productive.io/webhooks.html)",
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
    async deploy() {
      // Create a webhook for new deals
      const { id } = await this.productiveio.createWebhook({
        type: "deals",
        target_url: this.http.endpoint,
      });

      // Save the webhook information to the component's state
      this.db.set("webhookId", id);
    },
    async deactivate() {
      // Remove the webhook
      const webhookId = this.db.get("webhookId");
      await this.productiveio.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const productiveSignature = event.headers["productive-signature"];
    const [
      , signature,
    ] = productiveSignature.split(", s=");
    const token = this.productiveio.$auth.api_token;
    const timestamp = event.headers["date"];
    const payload = JSON.stringify(event.body);
    const computedSignature = crypto
      .createHmac("sha256", token)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    // Validate signature
    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(event.body, {
      id: event.body.data.id,
      summary: "New deal created",
      ts: Date.parse(event.body.data.attributes.created_at),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Success",
    });
  },
};
