import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const resourcesFn = this.getResourcesFn();
      const { [this.getResourcesName()]: resources } =
        await resourcesFn(this.getResourcesFnArgs());
      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
    async activate() {
      const response =
        await this.createWebhook({
          params: {
            target_url: this.http.endpoint,
            event_id: this.getEventId(),
          },
        });

      this.setWebhookId(response?.data?.id);
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
    ...common.methods,
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventId() {
      throw new ConfigurationError("getEventId is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    isSignatureValid({
      signature, body,
    }) {
      const { auth_token: authToken } = this.app.getAuth();

      const [
        timestamp,
        hash,
      ] = signature.match(/t=(.*?), s=(.*?)/);

      const payload = JSON.stringify(body);

      const computedSignature =
        crypto
          .createHmac("sha256", authToken)
          .update(`${timestamp}.${payload}`)
          .digest("hex");

      console.log("hash!!!", hash);
      console.log("computedSignature!!!", computedSignature);

      return hash === computedSignature;
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
  },
  async run({
    body, headers,
  }) {
    const signature = headers["Productive-Signature"];

    const isValid = this.isSignatureValid({
      signature,
      body,
    });

    if (!isValid) {
      console.log("Signatures don't match");
      return this.http.respond({
        status: 401,
      });
    }

    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
