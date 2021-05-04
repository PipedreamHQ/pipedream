const mailgun = require("../mailgun.app");

module.exports = {
  props: {
    mailgun,
    webhookSigningKey: {
      type: "string",
      secret: true,
      label: "Mailgun webhook signing key",
      description:
        "Your Mailgun webhook signing key, found [in your Mailgun dashboard](https://app.mailgun.com/app/dashboard), located under Settings on the left-hand nav and then in API Keys look for webhook signing key. Required to compute the authentication signature of events.",
      default: "key-1b219a1a57f665a8321f9d3860dbf538",
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    verify(signingKey, timestamp, token, signature) {
      const crypto = require("crypto");
      const encodedToken = crypto
        .createHmac("sha256", signingKey)
        .update(timestamp.concat(token))
        .digest("hex");
      return encodedToken === signature;
    },
    emitEvent(eventPayload) {
      const eventTypes = this.getEventType();
      if (eventTypes.includes(eventPayload.event)) {
        const meta = this.generateMeta(eventPayload);
        this.$emit(eventPayload, meta);
      }
    },
  },
  hooks: {
    async activate() {
      const webhookNames = this.getEventName();
      for (let i = 0; i < webhookNames.length; i++) {
        const webhookName = webhookNames[i];
        const webhookDetails = await this.mailgun.getWebhookDetails(
          this.domain,
          webhookName
        );
        if (webhookDetails && webhookDetails.urls) {
          const newWebhookUrls = webhookDetails.urls.slice();
          newWebhookUrls.push(this.http.endpoint);
          await this.mailgun.updateWebhook(
            this.domain,
            webhookName,
            newWebhookUrls
          );
        } else {
          await this.mailgun.createWebhook(
            this.domain,
            webhookName,
            this.http.endpoint
          );
        }
      }
    },
    async deactivate() {
      const webhookNames = this.getEventName();
      for (let i = 0; i < webhookNames.length; i++) {
        const webhookName = webhookNames[i];
        const webhookDetails = await this.mailgun.getWebhookDetails(
          this.domain,
          webhookName
        );
        if (
          webhookDetails &&
          webhookDetails.urls &&
          webhookDetails.urls.length > 1
        ) {
          const currentWebhookUrls = webhookDetails.urls.slice();
          const newWebhookUrls = currentWebhookUrls.filter(
            (url) => url !== this.http.endpoint
          );
          await this.mailgun.updateWebhook(
            this.domain,
            webhookName,
            newWebhookUrls
          );
        } else {
          await this.mailgun.deleteWebhook(this.domain, webhookName);
        }
      }
    },
  },
  async run(eventWorkload) {
    const { timestamp, token, signature } = eventWorkload.body.signature;
    const eventPayload = eventWorkload.body["event-data"];
    if (!this.verify(this.webhookSigningKey, timestamp, token, signature)) {
      this.http.respond({ status: 404 });
      console.log("Invalid event. Skipping...");
      return;
    }
    this.emitEvent(eventPayload);
  },
};
