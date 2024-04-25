import sellsy from "../../sellsy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sellsy-new-contact-instant",
  name: "New Contact Instant",
  description: "Emit a new event whenever a new contact is created in Sellsy",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sellsy,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    contactName: {
      propDefinition: [
        sellsy,
        "contactName",
      ],
      optional: true,
    },
    contactEmail: {
      propDefinition: [
        sellsy,
        "contactEmail",
      ],
      optional: true,
    },
    contactNumber: {
      propDefinition: [
        sellsy,
        "contactNumber",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        const response = await this.sellsy.createWebhook({
          url: this.http.endpoint,
          event: "new_contact",
        });
        this.db.set("webhookId", response.webhookId);
      }
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sellsy.deleteWebhook({
          webhookId,
        });
        this.db.remove("webhookId");
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["x-sellsy-signature"] !== this.sellsy.$auth.signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New contact: ${body.contactName}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
