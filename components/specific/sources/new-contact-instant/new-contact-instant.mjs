import specific from "../../specific.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "specific-new-contact-instant",
  name: "New Contact Created",
  description: "Emit new event whenever a new contact is created. [See the documentation](https://public-api.specific.app/docs/introduction/welcome)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    specific: {
      type: "app",
      app: "specific",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit historical events
      const contacts = await this.specific.emitNewContactCreated();
      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact: ${contact.name}`,
          ts: Date.parse(contact.createdAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.specific.emitNewContactCreated();
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.specific.emitNewContactCreated(webhookId);
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New contact created: ${event.body.name}`,
      ts: Date.parse(event.body.createdAt),
    });
  },
};
