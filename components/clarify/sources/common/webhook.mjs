import { ConfigurationError } from "@pipedream/platform";
import app from "../../clarify.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        workspace,
        createWebhook,
        http: { endpoint: url },
        setWebhookId,
        getEntity,
        getEventType,
      } = this;

      const response =
        await createWebhook({
          workspace,
          data: {
            url,
            entity: getEntity(),
            event_type: getEventType(),
          },
        });

      setWebhookId(response.id);
    },
    async deactivate() {
      const {
        workspace,
        deleteWebhook,
        getWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          workspace,
          webhookId,
        });
      }
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEntity() {
      throw new ConfigurationError("getEntity is not implemented");
    },
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook({
      workspace, ...args
    } = {}) {
      return this.app.post({
        path: `/workspaces/${workspace}/webhooks`,
        ...args,
      });
    },
    deleteWebhook({
      workspace, webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/workspaces/${workspace}/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
