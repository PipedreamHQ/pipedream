import { v4 as uuid } from "uuid";
import { createHmac } from "crypto";
import ciscoWebex from "../../cisco_webex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    ciscoWebex,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const secret = uuid();
      const { id: webhookId } =
        await this.ciscoWebex.createWebhook({
          data: {
            name: this.getWebhookName(),
            targetUrl: this.http.endpoint,
            resource: this.getResourceType(),
            event: this.getEventType(),
            secret,
          },
        });

      this.setWebhookId(webhookId);
      this.setWebhookSecret(secret);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.ciscoWebex.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setWebhookSecret(secret) {
      this.db.set(constants.WEBHOOK_SECRET, secret);
    },
    getWebhookSecret() {
      return this.db.get(constants.WEBHOOK_SECRET);
    },
    isWebhookValid(signature, bodyRaw) {
      const digest = createHmac("sha1", this.getWebhookSecret())
        .update(Buffer.from(bodyRaw, "utf8"))
        .digest("hex");
      return signature === digest;
    },
    getWebhookName() {
      throw new Error("getWebhookName is not implemented");
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getMetadata() {
      throw new Error("getMetadata is not implemented");
    },
  },
  async run(event) {
    const {
      headers,
      body,
      bodyRaw,
    } = event;

    const { [constants.SIGNATURE_HEADER]: signature } = headers;

    if (this.isWebhookValid(signature, bodyRaw)) {
      this.http.respond({
        status: 200,
        headers: {
          [constants.SIGNATURE_HEADER]: signature,
        },
      });

      const meta = this.getMetadata(body);
      this.$emit(body, meta);
    }
  },
};
