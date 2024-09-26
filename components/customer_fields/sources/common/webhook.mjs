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
      resources.forEach(this.processResource);
    },
    async activate() {
      const response =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            topic: this.getTopicName(),
          },
        });

      this.setWebhookId(response.webhook?.id);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          data: {
            topic: this.getTopicName(),
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
    getTopicName() {
      throw new ConfigurationError("getTopicName is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    getResourcesName() {
      throw new ConfigurationError("getResourcesName is not implemented");
    },
    createWebhook(args = {}) {
      return this.app.post({
        path: "/webhooks.json",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        path: "/webhooks.json",
        ...args,
      });
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
