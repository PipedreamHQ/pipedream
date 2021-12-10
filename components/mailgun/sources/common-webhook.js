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
      console.log("webhook");
      const response = await this.mailgun.api("request")
        .get(`/v3/domains/${domain}/webhooks/${webhook}`);
      console.log(JSON.stringify(response));
      return response.body.webhook.urls;
    },
    async createWebhook(domain, webhook, urls) {
      const response = await this.mailgun.api("request").post(`/v3/domains/${domain}/webhooks`, {
        id: webhook,
        url: urls,
      });
      return response.body.webhook.urls;
    },
    async updateWebhook(domain, webhook, urls) {
      console.log(JSON.stringify(urls));
      const response = await this.mailgun.api("request")
        .put(`/v3/domains/${domain}/webhooks/${webhook}`, {
          url: urls,
        });
      return response.body.webhook.urls;
    },
    async deleteWebhook(domain, webhook) {
      const response = await this.mailgun.api("request")
        .delete(`/v3/domains/${domain}/webhooks/${webhook}`);
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
        console.log("actiavte look");
        const urls = await this.getWebhook(this.domain, webhook);
        if (this.isSubscribed(urls)) {
          console.log("subscribed continueing");
          continue;
        }
        console.log("not subscribed");
        if (urls.length > 0) {
          console.log("updating webhook");
          await this.updateWebhook(
            this.domain,
            webhook,
            urls.concat(this.http.endpoint),
          );
          console.log("continue after updating webhook");
          continue;
        }
        console.log("creating webhook");
        await this.createWebhook(
          this.domain,
          webhook,
          [
            this.http.endpoint,
          ],
        );
        console.log("continue after creating webhook");
      }
    },
    async deactivate() {
      for (let webhook of this.getEventName()) {
        const urls = await this.getWebhook(this.domain, webhook);
        if (!this.isSubscribed(urls)) {
          continue;
        }
        if (urls.length > 1) {
          await this.updateWebhook(
            this.domain,
            webhook,
            urls.filter((url) => url !== this.http.endpoint),
          );
          continue;
        }
        await this.deleteWebhook(this.domain, webhook);
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
