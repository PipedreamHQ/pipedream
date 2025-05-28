import icontact from "../../icontact.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-contact-subscribed-instant",
  name: "New Contact Subscribed",
  description: "Emit new event when a contact is subscribed to a list. [See the documentation](https://help.icontact.com/customers/s/article/web-hooks-icontact-api)",
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
    listId: {
      propDefinition: [
        icontact,
        "listId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _computeSignature(secretKey, rawBody) {
      return crypto.createHmac("sha256", secretKey).update(rawBody)
        .digest("base64");
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.icontact._makeRequest({
        path: `/lists/${this.listId}/contacts`,
      });
      let count = 0;
      for (const contact of contacts.reverse()) {
        if (count < 50) {
          this.$emit(contact, {
            id: contact.contactId,
            summary: `New subscription: ${contact.email}`,
            ts: Date.parse(contact.subscribedAt),
          });
          count++;
        } else {
          break;
        }
      }
    },
    async activate() {
      const webhook = await this.icontact._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          eventType: "contact_subscribed",
          targetUrl: this.http.endpoint,
          triggerEvent: this.listId,
        },
      });
      this._setWebhookId(webhook.id);
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
    const signature = event.headers["x-icontact-signature"];
    const secretKey = this.icontact.$auth.api_key;
    const rawBody = event.body_raw;
    const computedSignature = this._computeSignature(secretKey, rawBody);

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const contact = event.body.contact;
    const listId = this.listId;

    if (event.body.type === "contact_subscribed" && event.body.listId === listId) {
      this.$emit(contact, {
        id: contact.contactId,
        summary: `Contact subscribed: ${contact.email}`,
        ts: Date.parse(event.body.timestamp),
      });
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
