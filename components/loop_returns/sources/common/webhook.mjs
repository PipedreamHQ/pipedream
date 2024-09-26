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
      const {
        createWebhook,
        updateWebhook,
        getEventData,
        setWebhookId,
      } = this;

      const args = {
        data: getEventData(),
      };

      const { id: webhookId } = await createWebhook(args);

      await updateWebhook({
        webhookId,
        data: {
          ...args.data,
          status: "active",
        },
      });

      setWebhookId(webhookId);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
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
    updateWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.put({
        path: `/webhooks/${webhookId}`,
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
