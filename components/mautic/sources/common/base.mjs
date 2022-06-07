import mautic from "../../mautic.app.mjs";
import crypto from "crypto";

export default {
  dedupe: "unique",
  type: "source",
  props: {
    mautic,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      console.log("Retrieving historical events...");
      const {
        fn,
        pathVariables,
        params,
      } = this.getEventListFn();
      const events = this.mautic.paginate({
        fn,
        params,
        pathVariables,
      });
      for await (const event of events) {
        if (this.isRelevant(event)) {
          this.emitEvent(event);
        }
      }
    },
    async activate() {
      console.log("Creating webhook...");
      const secret = crypto.randomUUID();
      const webhookId = await this.mautic.createWebhook({
        webhookUrl: this.http.endpoint,
        eventType: this.getEventType(),
        secret,
      });
      this.setSecret(secret);
      this.setWebhookId(webhookId);
      console.log(`Webhook ${webhookId} created successfully`);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      console.log(`Deleting webhook ${webhookId}...`);
      await this.mautic.deleteWebhook({
        webhookId,
      });
      this.setSecret();
      this.setWebhookId();
      console.log(`Webhook ${webhookId} deleted successfully`);
    },
  },
  methods: {
    getSecret() {
      return this.db.get("secret");
    },
    setSecret(secret) {
      this.db.set("secret", secret);
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    verifySignature(data, signature) {
      const secret = this.getSecret();
      const hash = crypto.createHmac("sha256", secret)
        .update(data)
        .digest("base64");
      return hash === signature;
    },
  },
  async run(event) {
    console.log("Raw received event:");
    console.log(event);

    if (!this.verifySignature(event.bodyRaw, event.headers["webhook-signature"])) {
      console.log("Signature does not match, skipping event");
      return;
    }

    for (const body of event.body[this.getEventType()]) {
      this.emitEvent(body);
    }
  },
};
