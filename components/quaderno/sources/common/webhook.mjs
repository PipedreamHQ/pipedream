import { createHmac } from "crypto";
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
    async activate() {
      const response =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            events_types: this.getEventName(),
          },
        });

      this.setWebhookId(response.id);
      this.setAuthKey(response.auth_key);
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
    setAuthKey(value) {
      this.db.set(constants.AUTH_KEY, value);
    },
    getAuthKey() {
      return this.db.get(constants.AUTH_KEY);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
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
    isSignatureValid(authKey, body, signature) {
      console.log("body", body);
      console.log("signature", signature);
      const hash = createHmac("sha1", authKey)
        .update(JSON.stringify(body))
        .digest("base64");
      return hash === signature;
    },
    processEvent(event) {
      this.$emit(event, this.generateMeta(event.data?.object || event));
    },
  },
  async run({
    body, headers,
  }) {
    const authKey = this.getAuthKey();
    const signature = headers["X-Quaderno-Signature"];

    if (!this.isSignatureValid(authKey, body, signature)) {
      throw new Error("Invalid signature");
    }

    this.processEvent(body);
  },
};
