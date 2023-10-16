import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";
import webhook from "../../common/queries/webhook.mjs";

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
      if (resourcesFn) {
        const { [this.getResourcesName()]: { nodes: resources } } =
          await resourcesFn(this.getResourcesFnArgs());
        resources.forEach(this.processResource);
      }
    },
    async activate() {
      const {
        createWebhook: {
          webhook,
          webhookUserErrors,
        },
      } =
        await this.createWebhook({
          input: {
            url: this.http.endpoint,
            subscriptions: this.getSubscriptions(),
          },
        });

      if (webhookUserErrors?.length) {
        throw new Error(JSON.stringify(webhookUserErrors));
      }

      this.setWebhookData(webhook);
    },
    async deactivate() {
      const data = this.getWebhookData();
      if (data?.id) {
        const {
          id: webhookId,
          ...webhook
        } = data;
        const { updateWebhook: { webhookUserErrors } } =
          await this.updateWebhook({
            input: {
              ...webhook,
              webhookId,
              active: false,
            },
          });

        if (webhookUserErrors?.length) {
          throw new Error(JSON.stringify(webhookUserErrors));
        }
      }
    },
  },
  methods: {
    ...common.methods,
    setWebhookData(value) {
      this.db.set(constants.WEBHOOK_DATA, value);
    },
    getWebhookData() {
      return this.db.get(constants.WEBHOOK_DATA);
    },
    getSubscriptions() {
      throw new ConfigurationError("getSubscriptions is not implemented");
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
    createWebhook(variables = {}) {
      return this.app.makeRequest({
        query: webhook.mutations.createWebhook,
        variables,
      });
    },
    updateWebhook(variables = {}) {
      return this.app.makeRequest({
        query: webhook.mutations.updateWebhook,
        variables,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body.data);
  },
};
