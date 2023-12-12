import crypto from "crypto";
import get from "lodash/get.js";
import base from "./base.mjs";

export default {
  ...base,
  props: {
    ...base.props,
    webhookSigningKey: {
      type: "string",
      secret: true,
      label: "Mailgun webhook signing key",
      description:
        "Your Mailgun webhook signing key, found " +
        "[in your Mailgun dashboard](https://app.mailgun.com/app/dashboard), located under " +
        "Settings on the left-hand nav and then in API Keys look for webhook signing key. " +
        "Required to compute the authentication signature of events.",
    },
    http: "$.interface.http",
  },
  methods: {
    ...base.methods,
    async getWebhook(domain, webhook) {
      let response;
      try {
        response = await this.mailgun.api("webhooks").list(domain);
        const webhookChek = [];
        webhookChek.push(webhook);
        if (webhookChek.includes("unsubscribed")) {
          return get(response, "unsubscribed.urls", []);
        } else if (webhookChek.includes("bounce")) {
          if (response.bounce) {
            const bounceUrlAsArr = [];
            bounceUrlAsArr.push(response.bounce.url);
            return bounceUrlAsArr;
          }
        } else if (webhookChek.includes("clicked")) {
          return get(response, "clicked.urls", []);
        } else if (webhookChek.includes("complained")) {
          return get(response, "complained.urls", []);
        } else if (webhookChek.includes("delivered")) {
          return get(response, "delivered.urls", []);
        } else if (webhookChek.includes("opened")) {
          return get(response, "opened.urls", []);
        } else if (webhookChek.includes("permanent_fail")) {
          return get(response, "permanent_fail.urls", []);
        } else if (webhookChek.includes("temporary_fail")) {
          return get(response, "temporary_fail.urls", []);
        }
      } catch (err) {
        console.log(`Error getting urls for webhook: ${webhook}, of domain ${domain}`, err);
      }
      return [];
    },
    async createWebhook(domain, webhook, url) {
      return this.mailgun.api("webhooks").create(domain, webhook, url);
    },
    async updateWebhook(domain, webhook, urls) {
      return this.mailgun.api("webhooks").update(domain, webhook, urls);
    },
    async deleteWebhook(domain, webhook) {
      return this.mailgun.api("webhooks").destroy(domain, webhook);
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
    getEventSubtype() {
      return null;
    },
    emitEvent(payload) {
      const expectedTypes = this.getEventType();
      const expectedSubtypes = this.getEventSubtype();
      if (!expectedTypes.includes(payload.event) ||
        (expectedSubtypes && !expectedSubtypes.includes(payload.severity))
      ) {
        if (!expectedTypes.includes(payload.event)) {
          console.debug("Expected", expectedTypes, "but got a", payload.event, "- skipping");
        } else {
          console.debug("Expected", expectedSubtypes, "but got a", payload.severity, "- skipping");
        }
        return;
      }
      this.$emit(payload, this.generateMeta(payload));
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
  },
  hooks: {
    ...base.hooks,
    async activate() {
      try {
        for (let webhook of this.getEventName()) {
          const urls = await this.getWebhook(this.domain, webhook);
          if (this.isSubscribed(urls)) {
            continue;
          }
          if (urls.length > 0) {
            await this.updateWebhook(
              this.domain,
              webhook,
              urls.concat(this.http.endpoint),
            );
            continue;
          }
          await this.createWebhook(
            this.domain,
            webhook,
            this.http.endpoint,
          );
        }
      } catch (err) {
        console.log("Error activating component:", err);
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
