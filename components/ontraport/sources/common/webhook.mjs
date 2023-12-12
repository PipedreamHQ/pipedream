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
      const { data: { id: webhookId } } =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            event: this.getEventName(),
          },
        });

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          data: {
            id: webhookId,
          },
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
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.create({
        path: "/Webhook/subscribe",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        path: "/Webhook/unsubscribe",
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    this.$emit(body, this.generateMeta(body));
  },
};
