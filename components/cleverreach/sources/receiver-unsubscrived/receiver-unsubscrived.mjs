import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cleverreach-receiver-unsubscribed",
  name: "Receiver Unsubscribed",
  description: "Emit new event when a receiver unsubscribes. [See docs here](https://rest.cleverreach.com/howto/webhooks.php)",
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
        url: this.http.endpoint,
        events: [
          "receiver.unsubscribed",
        ],
      };
      const { data } = await axios(this, {
        method: "POST",
        url: "https://rest.cleverreach.com/experimental/webhooks",
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
        data: config,
      });
      return data.id;
    },
    async deleteWebhook(id) {
      await axios(this, {
        method: "DELETE",
        url: `https://rest.cleverreach.com/experimental/webhooks/${id}`,
        headers: {
          Authorization: `Bearer ${this.cleverreach.$auth.oauth_access_token}`,
        },
      });
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
    const webhookSignature = headers["x-cr-signature"];
    const rawBody = JSON.stringify(body);
    const secretKey = this.cleverreach.$auth.oauth_access_token;
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
    this.$emit(body, {
      id: body.id,
      summary: `New event: ${body.event}`,
      ts: Date.parse(body.timestamp),
    });
  },
};
