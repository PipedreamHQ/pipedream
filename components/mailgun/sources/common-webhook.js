const mailgun = require("../mailgun.app");

module.exports = {
  props: {
    mailgun,
    webhookSigningKey: {
      type: "string",
      secret: true,
      label: "Mailgun webhook signing key",
      description:
        "Your Mailgun webhook signing key, found [in your Mailgun dashboard](https://app.mailgun.com/app/dashboard), located under Settings on the left-hand nav and then in API Keys look for webhook signing key. Required to compute the authentication signature of events. ",
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
    emitEvent(eventWorkload) {
      const eventPayload = eventWorkload["event-data"];
      if (eventTypes.indexOf(eventPayload.event) > -1) {
        const meta = this.generateMeta();
        this.$emit(eventPayload, meta);
      }
    },
  },
  hooks: {
    async activate() {
      const webhookName = this.getEventName();
      const webhookDetails = await this.mailgun.getWebhookDetails(
        this.domain,
        webhookName
      );
      if (webhookDetails && webhookDetails.urls) {
        const newWebhookUrls = webhookDetails.urls.slice();
        newWebhookUrls.push(this.http.endpoint);
        const updated = await this.mailgun.updateWebhook(
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
    },
    async deactivate() {
      const webhookName = this.getEventName();
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
        const newWebhookUrls = [];
        currentWebhookUrls.forEach((url) => {
          if (!(url === this.http.endpoint)) {
            newWebhookUrls.push(url);
          }
        });
        await this.mailgun.updateWebhook(this.domain, webhookName, newWebhookUrls);
      } else {
        await this.mailgun.deleteWebhook(this.domain, webhookName);
      }
    },
  },
  async run(eventWorkload) {
    const { timestamp, token, signature } = eventWorkload.signature;
    const eventPayload = eventWorkload["event-data"];
    if (!verify(this.webhookSigningKey, timestamp, token, signature)) {
      throw new Error("signature mismatch");
    }
    this.emitEvent(eventPayload);
  },
};