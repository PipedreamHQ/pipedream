import crypto from "crypto";
import { v4 as uuid } from "uuid";
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
      const secret = uuid();

      const response =
        await this.createWebhook({
          data: {
            target_url: this.http.endpoint,
            event: this.getEventName(),
            secret,
          },
        });

      this.setSecret(secret);
      this.setWebhookId(response.hooks[0]?.id);
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
    setSecret(value) {
      this.db.set(constants.SECRET, value);
    },
    getSecret() {
      return this.db.get(constants.SECRET);
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.create({
        path: "/hooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/hooks/${webhookId}`,
        ...args,
      });
    },
    getDigest(body) {
      return crypto.createHmac(constants.SHA1_ALGORITHM, this.getSecret())
        .update(body)
        .digest(constants.ENCODING);
    },
  },
  async run({
    body, bodyRaw, headers,
  }) {
    const signature = headers["x-paymo-signature"].split("=")[1];
    const digest = this.getDigest(bodyRaw);

    if (digest !== signature) {
      console.error("Invalid signature");
      return;
    }

    this.$emit(body, this.generateMeta(body));
  },
};
