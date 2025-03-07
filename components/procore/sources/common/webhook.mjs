import { v4 as uuid } from "uuid";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../procore.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    webhookType: {
      type: "string",
      label: "Webhook Type",
      description: "The type of webhook to create.",
      options: Object.values(constants.WEBHOOK_TYPE),
      default: constants.WEBHOOK_TYPE.COMPANY.value,
      reloadProps: true,
    },
    eventTypes: {
      propDefinition: [
        app,
        "eventTypes",
      ],
    },
  },
  async additionalPropperties() {
    if (this.webhookType === constants.WEBHOOK_TYPE.PROJECT.value) {
      return {
        projectId: {
          propDefinition: [
            app,
            "projectId",
          ],
          options: async ({ page }) => {
            const { companyId } = this;
            const results = await this.app.listProjectsV2({
              companyId,
              params: {
                company_id: companyId,
                per_page: constants.DEFAULT_LIMIT,
                page: page + 1,
              },
            });
            return results.map(({
              id: value, name: label,
            }) => ({
              label,
              value,
            }));
          },
        },
      };
    }
    return {};
  },
  hooks: {
    async activate() {
      const {
        companyId,
        projectId,
        eventTypes,
        createWebhooksHook,
        bulkCreateWebhooksTriggers,
        getResourceName,
        http: { endpoint: destinationUrl },
        setToken,
        setWebhookHookId,
        setWebhookTriggerIds,
      } = this;

      const id = uuid();
      const token = Buffer.from(id).toString("base64");

      const hookResponse =
        await createWebhooksHook({
          companyId,
          data: {
            company_id: companyId,
            project_id: projectId,
            hook: {
              api_version: "v2",
              destination_url: destinationUrl,
              namespace: "pipedream",
              destination_headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          },
        });

      setToken(token);
      setWebhookHookId(hookResponse.id);

      const triggers = eventTypes.map((eventType) => ({
        resource_name: getResourceName(),
        event_type: eventType,
      }));

      const triggerResponses = await bulkCreateWebhooksTriggers({
        companyId,
        hookId: hookResponse.id,
        data: {
          api_version: "v2",
          company_id: companyId,
          project_id: projectId,
          triggers,
        },
      });

      setWebhookTriggerIds(triggerResponses?.success.map(({ id }) => id));

    },
    async deactivate() {
      const {
        deleteWebhooksHook,
        bulkDeleteWebhooksTriggers,
        getWebhookHookId,
        getWebhookTriggerIds,
        companyId,
        projectId,
      } = this;

      const hookId = getWebhookHookId();
      const triggerIds = getWebhookTriggerIds();

      await bulkDeleteWebhooksTriggers({
        companyId,
        hookId,
        data: {
          company_id: companyId,
          project_id: projectId,
          triggers: triggerIds,
        },
      });

      await deleteWebhooksHook({
        hookId,
        companyId,
        params: {
          company_id: companyId,
          project_id: projectId,
        },
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setToken(value) {
      this.db.set(constants.TOKEN, value);
    },
    getToken() {
      return this.db.get(constants.TOKEN);
    },
    setWebhookHookId(value) {
      this.db.set(constants.WEBHOOK_HOOK_ID, value);
    },
    getWebhookHookId() {
      return this.db.get(constants.WEBHOOK_HOOK_ID);
    },
    setWebhookTriggerIds(values) {
      this.db.set(constants.WEBHOOK_TRIGGER_IDS, values);
    },
    getWebhookTriggerIds() {
      return this.db.get(constants.WEBHOOK_TRIGGER_IDS);
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    createWebhooksHook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/webhooks/hooks",
        ...args,
      });
    },
    deleteWebhooksHook({
      hookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/webhooks/hooks/${hookId}`,
        ...args,
      });
    },
    bulkCreateWebhooksTriggers({
      hookId, ...args
    } = {}) {
      return this.app.post({
        debug: true,
        path: `/webhooks/hooks/${hookId}/triggers/bulk`,
        ...args,
      });
    },
    bulkDeleteWebhooksTriggers({
      hookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/webhooks/hooks/${hookId}/triggers/bulk`,
        ...args,
      });
    },
    async getDataToEmit(body) {
      return body;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    const resource = await this.getDataToEmit(body);
    this.processResource(resource);
  },
};
