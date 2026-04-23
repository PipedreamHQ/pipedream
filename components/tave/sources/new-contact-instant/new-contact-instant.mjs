import tave from "../../tave.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tave-new-contact-instant",
  name: "New Contact Created",
  description: "Emit new event when a contact is created. [See the documentation](https://tave.io/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tave,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    clientId: {
      propDefinition: [
        tave,
        "clientId",
      ],
    },
  },
  methods: {
    async _emitWebhookEvent(contact) {
      this.$emit(contact, {
        id: contact.id,
        summary: `New contact created: ${contact.name}`,
        ts: contact.createdAt
          ? Date.parse(contact.createdAt)
          : Date.now(),
      });
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const events = await this.tave.emitNewContactEvent(this.clientId);
      for (const event of events) {
        this._emitWebhookEvent(event);
      }
    },
    async activate() {
      const hookId = await this.tave.emitNewContactEvent(this.clientId);
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const hookId = this._getWebhookId();
      if (hookId) {
        await this.tave.emitNewContactEvent(this.clientId); // Assuming the method handles the deletion
      }
    },
  },
  async run(event) {
    const contact = event.body;
    this._emitWebhookEvent(contact);
  },
};
