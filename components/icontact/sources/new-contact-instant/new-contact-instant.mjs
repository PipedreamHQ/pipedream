import icontact from "../../icontact.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-new-contact-instant",
  name: "New Contact Created",
  description: "Emit new event when a contact is created. [See the documentation](https://help.icontact.com/customers/s/article/web-hooks-icontact-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    icontact: {
      type: "app",
      app: "icontact",
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
    async _verifySignature(event) {
      const computedSignature = require("crypto")
        .createHmac("sha256", this.icontact.$auth.api_key)
        .update(event.rawBody)
        .digest("base64");

      const webhookSignature = event.headers["x-icontact-signature"];
      return computedSignature === webhookSignature;
    },
  },
  hooks: {
    async deploy() {
      // Implement fetching and emitting historical events if the API supports this
    },
    async activate() {
      const response = await this.icontact._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "contact.created",
          target_url: this.http.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.icontact._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    if (!await this._verifySignature(event)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { data: contact } = event;
    this.$emit(contact, {
      id: contact.contactId,
      summary: `New contact created: ${contact.firstName} ${contact.lastName} (${contact.contactEmail})`,
      ts: Date.parse(contact.createdAt),
    });
  },
};
