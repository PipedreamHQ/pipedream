const mailgun = require("../mailgun.app");
const crypto = require("crypto");
const get = require("lodash.get");

module.exports = {
  props: {
    mailgun,
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    verifySignature({ timestamp, token, signature }) {
      const encodedToken = crypto
        .createHmac("sha256", this.webhookSigningKey)
        .update(timestamp.concat(token))
        .digest("hex");
      return encodedToken === signature;
    },
    emitEvent(payload) {
      const expectedTypes = this.getEventType();
      if (!t.includes(payload.event)) {
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
            this.http.endpoint
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
            urls.filter(url => url !== this.http.endpoint),
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
