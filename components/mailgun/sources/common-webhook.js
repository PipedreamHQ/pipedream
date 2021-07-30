const mailgun = require("../mailgun.app");
const crypto = require("crypto");
const get = require("lodash.get");

module.exports = {
  props: {
    mailgun,
    domain: {
      propDefinition: [
        mailgun,
        "domain",
      ],
    },
    webhookSigningKey: {
      propDefinition: [
        mailgun,
        "webhookSigningKey",
      ],
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    async getWebhook(domain, webhook) {
      const response = await this.mailgun.api("request")
        .get(`/domains/${domain}/webhooks/${webhook}`);
      return response.body.webhook.urls;
    },
    async createWebhook(domain, webhook, urls) {
      const response = await this.mailgun.api("request").post(`/domains/${domain}/webhooks`, {
        id: webhook,
        url: urls,
      });
      return response.body.webhook.urls;
    },
    async updateWebhook(domain, webhook, urls) {
      const response = await this.mailgun.api("request")
        .put(`/domains/${domain}/webhooks/${webhook}`, {
          url: urls,
        });
      return response.body.webhook.urls;
    },
    async deleteWebhook(domain, webhook) {
      const response = await this.mailgun.api("request")
        .delete(`/domains/${domain}/webhooks/${webhook}`);
      return response.body.webhook.urls;
    },
    isSubscribed(urls = []) {
      return (
        urls.length > 0
        && urls.includes(this.http.endpoint)
      );
    },
    getEventName() {
      throw new Error("getEventName is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta(payload) {
      return {
        id: `${payload["X-Mailgun-Sid"]}${payload.id}${payload.timestamp}`,
        summary: payload.recipient,
        ts: payload.timestamp,
      };
    },
    verifySignature({
      timestamp, token, signature,
    }) {
      const encodedToken = crypto
        .createHmac("sha256", this.webhookSigningKey)
        .update(timestamp.concat(token))
        .digest("hex");
      return encodedToken === signature;
    },
    emitEvent(payload) {
      const expectedTypes = this.getEventType();
      if (!expectedTypes.includes(payload.event)) {
        console.debug("Expected", expectedTypes, "but got a", payload.event, "- skipping");
        return;
      }
      this.$emit(payload, this.generateMeta(payload));
    },
  },
  hooks: {
    async activate() {
      for (let webhook of this.getEventName()) {
        const urls = await this.mailgun.getWebhook(this.domain, webhook);

        if (this.isSubscribed(urls)) {
          continue;
        }

        if (urls.length > 0) {
          await this.mailgun.updateWebhook(
            this.domain,
            webhook,
            urls.concat(this.http.endpoint),
          );
          continue;
        }

        await this.mailgun.createWebhook(
          this.domain,
          webhook,
          [
            this.http.endpoint,
          ],
        );
      }
    },
    async deactivate() {
      for (let webhook of this.getEventName()) {
        const urls = await this.mailgun.getWebhook(this.domain, webhook);

        if (!this.isSubscribed(urls)) {
          continue;
        }

        if (urls.length > 1) {
          await this.mailgun.updateWebhook(
            this.domain,
            webhook,
            urls.filter((url) => url !== this.http.endpoint),
          );
          continue;
        }

        await this.mailgun.deleteWebhook(this.domain, webhook);
      }
    },
  },
  async run(event) {
    if (!get(event, "body.signature", false)) {
      console.warn("Webhook signature missing, skipping");
      return;
    }

    if (!this.verifySignature(event.body.signature)) {
      this.http.respond({
        status: 401,
      });
      console.warn("Webhook signature invalid, skipping");
      return;
    }

    this.emitEvent(event.body["event-data"]);
  },
};
