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
    isSignatureValid(signature, data, skip = true) {
      // skip signature validation for now. Due to the following issue:
      // https://github.com/quaderno/quaderno-api/issues/54
      if (skip) {
        return true;
      }
      const authKey = this.getAuthKey();
      const computedSignature = createHmac("sha1", authKey)
        .update(data)
        .digest("base64");

      return computedSignature === signature;
    },
    processEvent(event) {
      this.$emit(event, this.generateMeta(event.data?.object || event));
    },
  },
  async run({
    method, url, body, headers, bodyRaw,
  }) {
    if (method === "HEAD") {
      return this.http.respond({
        status: 200,
      });
    }

    const signature = headers["x-quaderno-signature"];
    const data = `${url}${bodyRaw}`;

    if (!this.isSignatureValid(signature, data)) {
      throw new Error("Invalid signature");
    }

    this.processEvent(body);
  },
};
