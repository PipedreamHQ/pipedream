import printful from "../../printful.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "printful-new-product-added-instant",
  name: "New Product Added",
  description: "Emit new event when a new product is added to your Printful store catalog. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    printful: {
      type: "app",
      app: "printful",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch the latest 50 products sorted by creation date
      const products = await this.printful.listProducts({
        params: {
          limit: 50,
          sort: "created_at",
        },
      });
      // Emit from oldest to newest
      for (const product of products.reverse()) {
        this.$emit(product, {
          id: product.id.toString(),
          summary: `New product added: ${product.name}`,
          ts: Date.parse(product.created_at),
        });
      }
    },
    async activate() {
      // Create a webhook subscription for product creation events
      const webhookUrl = this.http.endpoint;
      const response = await this.printful._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: webhookUrl,
          events: [
            "product.created",
          ],
        },
      });
      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Delete the webhook subscription using the stored webhook ID
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.printful._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    // Validate the webhook signature
    const secretKey = this.printful.$auth.webhook_secret;
    const rawBody = event.body;
    const webhookSignature = event.headers["x-printful-signature"];
    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");
    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Parse and emit the product event
    const product = JSON.parse(rawBody);
    this.$emit(product, {
      id: product.id.toString(),
      summary: `New product added: ${product.name}`,
      ts: product.created_at
        ? Date.parse(product.created_at)
        : Date.now(),
    });
  },
};
