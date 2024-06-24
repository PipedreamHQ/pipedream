import { axios } from "@pipedream/platform";
import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-new-contact-instant",
  name: "New Contact Instant",
  description: "Emit new event when a contact is created. [See the documentation](https://www.kommo.com/developers/content/platform/abilities/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kommo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.kommo._makeRequest({
        method: "GET",
        path: "/contacts",
        params: {
          limit: 50,
          order: "desc",
        },
      });

      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.name}`,
          ts: Date.parse(contact.created_at),
        });
      }
    },
    async activate() {
      await this.kommo.addWebhook("https://example.com/webhook/contact", [
        "add_contact",
      ]);
    },
    async deactivate() {
      await this.kommo.deleteWebhook("https://example.com/webhook/contact");
    },
  },
  async run() {
    const events = await this.kommo.getWebhookEvents();
    for (const event of events) {
      if (event.settings.includes("add_contact")) {
        this.$emit(event, {
          id: event.id,
          summary: `New Contact: ${event.contact.name}`,
          ts: event.created_at * 1000, // Assuming created_at is in seconds
        });
      }
    }
  },
};
