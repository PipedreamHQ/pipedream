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
          data: {
            hookUrl: this.http.endpoint,
            webhookEvents: this.getEvents(),
          },
        });

      this.setWebhookId(response.id);
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
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
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
    createWebhook(args = {}) {
      return this.app.post({
        path: "/hooks/subscribe",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/hooks/unsubscribe/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
