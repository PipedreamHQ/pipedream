import { createHmac } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../shiphero.app.mjs";
import constants from "../../common/constants.mjs";
import webhookMutations from "../../common/mutations/webhook.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    shopName: {
      type: "string",
      label: "Shop Name",
      description: "The name of the shop. Eg: `pipedream-api`",
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: url },
        createWebhook,
        getEventName,
        setSharedSignatureSecret,
        shopName,
      } = this;
      const response =
        await createWebhook({
          url,
          name: getEventName(),
          shopName,
        });
      setSharedSignatureSecret(response.webhook_create.webhook.shared_signature_secret);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getEventName,
        shopName,
      } = this;
      await deleteWebhook({
        name: getEventName(),
        shopName,
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setSharedSignatureSecret(value) {
      this.db.set(constants.SHARED_SIGNATURE_SECRET, value);
    },
    getSharedSignatureSecret() {
      return this.db.get(constants.SHARED_SIGNATURE_SECRET);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    verifySignature(bodyRaw, signature) {
      const signatureSecret = this.getSharedSignatureSecret();
      const hash = createHmac("sha256", signatureSecret)
        .update(bodyRaw)
        .digest("base64");
      return hash === signature;
    },
    createWebhook(variables = {}) {
      return this.app.makeRequest({
        query: webhookMutations.createWebhook,
        variables,
      });
    },
    deleteWebhook(variables = {}) {
      return this.app.makeRequest({
        query: webhookMutations.deleteWebhook,
        variables,
      });
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    const signature = headers["x-shiphero-hmac-sha256"];
    const {
      http,
      verifySignature,
      processResource,
    } = this;

    if (!signature) {
      console.log("No signature found");
      return http.respond({
        status: 401,
      });
    }

    const isValidSignature = verifySignature(bodyRaw, signature);

    if (!isValidSignature) {
      console.log("Invalid signature");
      return http.respond({
        status: 401,
      });
    }

    http.respond({
      status: 200,
    });

    processResource(body);
  },
};
