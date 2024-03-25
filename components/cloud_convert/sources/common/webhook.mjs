import { createHmac } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../cloud_convert.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const {
        data: {
          id: webhookId,
          signing_secret: secret,
        },
      } =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            events: this.getEvents(),
          },
        });

      this.setWebhookId(webhookId);
      this.setSecret(secret);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setSecret(value) {
      this.db.set(constants.SECRET, value);
    },
    getSecret() {
      return this.db.get(constants.SECRET);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this.app.delete({
        debug: true,
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    isSignatureValid(body, signature) {
      const secret = this.getSecret();

      const computedSignature =
        createHmac("sha256", secret)
          .update(body)
          .digest("hex");

      return signature === computedSignature;
    },
  },
  async run({
    body, bodyRaw, headers: { ["cloudconvert-signature"]: signature },
  }) {
    const isValid = this.isSignatureValid(bodyRaw, signature);

    if (!isValid) {
      return console.log("Invalid signature");
    }

    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
