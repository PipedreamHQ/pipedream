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

      if (!resourcesFn) {
        console.log("There is no resourcesFn supported in the API");
        return;
      }

      const resources = await resourcesFn(this.getResourcesFnArgs());

      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
    async activate() {
      const response =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            ...this.getEventData(),
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
    getEventData() {
      throw new ConfigurationError("getEventData is not implemented");
    },
    getResourcesFn() {
      return;
    },
    getResourcesFnArgs() {
      return;
    },
    isResourceRelevant() {
      return true;
    },
    processResource(resource) {
      if (this.isResourceRelevant(resource)) {
        return this.$emit(resource, this.generateMeta(resource));
      }
      console.log("Skipping irrelevant resource", resource);
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
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
