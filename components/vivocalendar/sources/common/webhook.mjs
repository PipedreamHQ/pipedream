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
      const {
        http: { endpoint },
        getEventType,
      } = this;

      const eventType = getEventType();
      const response =
        await this.createWebhook({
          params: {
            "api_subscription[callback_url]": endpoint,
            "api_subscription[event_type]": eventType,
          },
          data: {
            api_subscription: {
              callback_url: endpoint,
              event_type: eventType,
            },
          },
        });

      this.setWebhookId(response?.response?.subscription?.id);
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
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource?.object));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/api_subscriptions",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/api_subscriptions/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
