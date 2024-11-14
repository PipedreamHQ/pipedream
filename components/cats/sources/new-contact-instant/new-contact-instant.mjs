import cats from "../../cats.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cats-new-contact-instant",
  name: "New Contact Created",
  description: "Emit a new event when a contact related to a cat is created. [See the documentation](https://docs.catsone.com/api/v3/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cats: {
      type: "app",
      app: "cats",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const contacts = await this.cats._makeRequest({
        path: "/contacts",
        params: {
          limit: 50,
          orderBy: "created_at.desc",
        },
      });
      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact: ${contact.firstName} ${contact.lastName}`,
          ts: Date.parse(contact.createdAt),
        });
      }
    },
    async activate() {
      const webhookData = {
        events: [
          "contact.created",
        ],
        target_url: this.http.endpoint,
        secret: this.db.get("secret"),
      };
      const response = await this.cats._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: webhookData,
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.cats._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const webhookSignature = event.headers["x-signature"];
    const requestId = event.headers["x-request-id"];
    const secret = this.db.get("secret") || "your_secret_key";
    const rawBody = event.rawBody;

    const computedSignature = `HMAC-SHA256 ${crypto.createHmac("sha256", secret).update(rawBody + requestId)
      .digest("hex")}`;

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const contact = event.body;
    this.$emit(contact, {
      id: contact.id,
      summary: `New contact: ${contact.firstName} ${contact.lastName}`,
      ts: Date.parse(contact.createdAt),
    });
  },
};
