import crypto from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../clio.app.mjs";
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
        getEvents,
        getModel,
        fields,
        getRelevantFields,
      } = this;

      const fieldsSet = new Set(
        [
          "created_at",
          "updated_at",
        ].concat(fields || [])
          .concat(getRelevantFields()),
      );

      const response =
        await createWebhook({
          data: {
            data: {
              url,
              events: getEvents(),
              model: getModel(),
              fields: Array.from(fieldsSet).join(","),
            },
          },
        });

      setWebhookId(response.data.id);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteWebhook,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
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
    getRelevantFields() {
      return [];
    },
    isRelevant() {
      return true;
    },
    isSignatureValid(signature, rawBody) {
      const secret = this.getSecret();
      const digest =
        crypto
          .createHmac("sha256", secret)
          .update(rawBody)
          .digest("hex");
      return digest === signature;
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    getModel() {
      throw new ConfigurationError("getModel is not implemented");
    },
    processResource(resource) {
      if (!this.isRelevant(resource)) {
        return console.log("Ignoring resource!", resource);
      }
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/webhooks.json",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/webhooks/${webhookId}.json`,
        ...args,
      });
    },
  },
  async run({
    body, bodyRaw, headers: {
      [constants.SECRET_HEADER]: secret,
      [constants.SIGNATURE_HEADER]: signature,
    },
  }) {
    const {
      http: { respond },
      getSecret,
      setSecret,
      processResource,
      isSignatureValid,
    } = this;

    const currentSecret = getSecret();
    if (!currentSecret) {
      console.log("First handshake. Storing secret!");
      setSecret(secret);
      return respond({
        status: 200,
        body: "OK",
        headers: {
          [constants.SECRET_HEADER]: secret,
        },
      });
    }

    if (signature && !isSignatureValid(signature, bodyRaw)) {
      console.log("Invalid signature!");
      return respond({
        status: 401,
      });
    }

    processResource(body);
  },
};
