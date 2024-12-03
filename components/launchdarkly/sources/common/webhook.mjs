import { createHmac } from "crypto";
import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../launchdarkly.app.mjs";
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
        http: { endpoint: url },
        createWebhook,
        setWebhookId,
        setSecret,
        getStatements,
      } = this;

      const secret = uuid();
      const response =
        await createWebhook({
          data: {
            name: "Pipedream Webhook",
            url,
            statements: getStatements(),
            secret,
            sign: true,
            on: true,
          },
        });

      setWebhookId(response._id);
      setSecret(secret);
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
    getStatements() {
      throw new ConfigurationError("getStatements is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    isSignatureValid(signature, bodyRaw) {
      if (!signature) {
        return false;
      }

      const secret = this.getSecret();

      const computedSignature =
        createHmac("sha256", secret)
          .update(bodyRaw)
          .digest("hex");

      return signature === computedSignature;
    },
  },
  async run({
    headers, body, bodyRaw,
  }) {
    const {
      http,
      isSignatureValid,
    } = this;

    const signature = headers["x-ld-signature"];

    if (!isSignatureValid(signature, bodyRaw)) {
      console.log("Invalid signature");
      return http.respond({
        status: 401,
      });
    }

    http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
