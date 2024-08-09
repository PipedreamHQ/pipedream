import { createHmac } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../paradym.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: url },
        setWebhookId,
        setSignatureSecret,
        createWebhook,
        projectId,
        name,
        getEventTypes,
      } = this;
      const response =
        await createWebhook({
          projectId,
          data: {
            name,
            url,
            eventTypes: getEventTypes(),
          },
        });

      setWebhookId(response.id);
      setSignatureSecret(response.signatureSecret);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteWebhook,
        projectId,
      } = this;
      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          projectId,
          webhookId,
        });
      }
    },
  },
  methods: {
    setSignatureSecret(value) {
      this.db.set(constants.SIGNATURE_SECRET, value);
    },
    getSignatureSecret() {
      return this.db.get(constants.SIGNATURE_SECRET);
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    createWebhook({
      projectId, ...args
    } = {}) {
      return this.app.post({
        debug: true,
        path: `/projects/${projectId}/webhooks`,
        ...args,
      });
    },
    deleteWebhook({
      projectId, webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/projects/${projectId}/webhooks/${webhookId}`,
        ...args,
      });
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    verifySignature(bodyRaw, signature) {
      const signatureSecret = this.getSignatureSecret();
      const hash = createHmac("sha256", signatureSecret)
        .update(bodyRaw)
        .digest("hex");
      return hash === signature;
    },
  },
  async run({
    body, headers: { ["x-paradym-hmac-sha-256"]: signature }, bodyRaw,
  }) {
    const {
      http,
      verifySignature,
      processResource,
    } = this;

    const validSignature = verifySignature(bodyRaw, signature);

    if (!validSignature) {
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
