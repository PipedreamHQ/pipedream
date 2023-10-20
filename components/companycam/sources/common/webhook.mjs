import {
  createHmac, timingSafeEqual,
} from "crypto";
import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const token = uuid();
      const response =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            scopes: this.getScopes(),
            enabled: true,
            token,
          },
        });

      this.setWebhookId(response.id);
      this.setToken(token);
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
    setToken(value) {
      this.db.set(constants.TOKEN, value);
    },
    getToken() {
      return this.db.get(constants.TOKEN);
    },
    getScopes() {
      throw new ConfigurationError("getScopes is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.create({
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
    isSignatureValid(data, signature) {
      const hash =
        createHmac("sha1", this.getToken())
          .update(data)
          .digest("base64");
      return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    },
  },
  async run({
    body, headers, bodyRaw,
  }) {
    const signature = headers["x-companycam-signature"];

    if (!this.isSignatureValid(bodyRaw, signature)) {
      console.log("Invalid signature");
      return;
    }

    this.$emit(body, this.generateMeta(body));
  },
};
