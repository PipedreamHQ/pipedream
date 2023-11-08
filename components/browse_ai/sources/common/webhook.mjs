import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
    robotId: {
      propDefinition: [
        common.props.app,
        "robotId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const {
        getResourcesFn,
        getResourcesFnArgs,
        getResourcesName,
        processResource,
      } = this;

      const resourcesFn = getResourcesFn();
      const response = await resourcesFn(getResourcesFnArgs());
      const resourcesName = getResourcesName();
      const resources = resourcesName
          && resourcesName.split(".").reduce((acc, path) => acc[path], response)
          || response;

      Array.from(resources)
        .reverse()
        .forEach(processResource);
    },
    async activate() {
      const {
        http,
        createWebhook,
        getEventName,
        setWebhookId,
        robotId,
      } = this;

      const response =
        await createWebhook({
          robotId,
          data: {
            hookUrl: http.endpoint,
            eventType: getEventName(),
          },
        });

      setWebhookId(response?.webhook?.id);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteWebhook,
        robotId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
          robotId,
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
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook({
      robotId, ...args
    } = {}) {
      return this.app.post({
        path: `/robots/${robotId}/webhooks`,
        ...args,
      });
    },
    deleteWebhook({
      robotId, webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/robots/${robotId}/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body.task);
  },
};
