import icontact from "../../icontact.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "icontact-updated-contact-instant",
  name: "Updated Contact Instant",
  description: "Emit new event when a contact is updated. [See the documentation](https://help.icontact.com/customers/s/article/web-hooks-icontact-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    icontact,
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
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit past events
      console.log("Deploying hook to fetch historical contact update data");
      const contacts = await this.icontact.getContacts({
        max: 50,
      });
      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.contactId,
          summary: `Contact Updated: ${contact.email}`,
          ts: Date.parse(contact.updatedAt),
        });
      });
    },
    async activate() {
      const opts = {
        method: "POST",
        path: "/webhooks",
        data: {
          events: [
            "contact.updated",
          ],
          target_url: this.http.endpoint,
        },
      };
      const response = await this.icontact._makeRequest(opts);
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        const opts = {
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        };
        await this.icontact._makeRequest(opts);
      }
    },
  },
  async run(event) {
    const secretKey = this.icontact.$auth.secret;
    const rawBody = event.body;
    const webhookSignature = event.headers["x-icontact-signature"];

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const data = JSON.parse(rawBody);
    const {
      contactId, email, updatedAt,
    } = data;

    this.$emit(data, {
      id: contactId,
      summary: `Updated contact: ${email}`,
      ts: updatedAt
        ? Date.parse(updatedAt)
        : Date.now(),
    });
  },
};
