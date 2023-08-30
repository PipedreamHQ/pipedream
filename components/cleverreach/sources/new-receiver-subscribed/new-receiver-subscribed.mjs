import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cleverreach-new-receiver-subscribed",
  name: "New Receiver Subscribed",
  description: "Emit new event when a receiver is subscribed. [See docs here](https://rest.cleverreach.com/howto/webhooks.php)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    cleverreach: {
      type: "app",
      app: "cleverreach",
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
    async createWebhook() {
      const config = {
        method: "POST",
        url: "https://rest.cleverreach.com/v3/webhooks",
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        data: {
          url: this.http.endpoint,
          events: [
            "receiver.subscribed",
          ],
        },
      };
      const response = await axios(this, config);
      return response.data.id;
    },
    async deleteWebhook(id) {
      const config = {
        method: "DELETE",
        url: `https://rest.cleverreach.com/v3/webhooks/${id}`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
      };
      await axios(this, config);
    },
  },
  hooks: {
    async deploy() {
      const hookId = await this.createWebhook();
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.deleteWebhook(id);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const webhookSecret = this.cleverreach.$auth.oauth_access_token;
    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (headers["x-cr-signature"] !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New receiver subscribed: ${body.email}`,
      ts: Date.parse(body.timestamp),
    });
  },
};
