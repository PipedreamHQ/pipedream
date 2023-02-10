import { ConfigurationError } from "@pipedream/platform";
import app from "../../procore.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
  },
  methods: {
    setTriggerIds(value) {
      this.db.set(constants.TRIGGER_IDS, value);
    },
    getTriggerIds() {
      return this.db.get(constants.TRIGGER_IDS) || [];
    },
    setHookId(value) {
      this.db.set(constants.HOOK_ID, value);
    },
    getHookId() {
      return this.db.get(constants.HOOK_ID);
    },
    getComponentEventTypes() {
      return Object.values(constants.EVENT_TYPES).map(({ value }) => value);
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    createHook(args = {}) {
      return this.app.create({
        path: "/webhooks/hooks",
        ...args,
      });
    },
    deleteHook({
      hookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhooks/hooks/${hookId}`,
        ...args,
      });
    },
    createHookTrigger({
      hookId, ...args
    } = {}) {
      return this.app.create({
        path: `/webhooks/hooks/${hookId}/triggers`,
        ...args,
      });
    },
    deleteHookTrigger({
      hookId, triggerId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhooks/hooks/${hookId}/triggers/${triggerId}`,
        ...args,
      });
    },
  },
  hooks: {
    async activate() {
      const {
        companyId,
        projectId,
      } = this;

      const hook = await this.createHook({
        headers: this.app.companyHeader(companyId),
        data: {
          company_id: companyId,
          project_id: projectId,
          hook: {
            api_version: constants.API_VERSION.DEFAULT,
            destination_url: this.http.endpoint,
          },
        },
      });

      this.setHookId(hook.id);

      const eventTypes = this.getComponentEventTypes();
      const resourceName = this.getResourceName();

      const triggerIds = [];
      for (const eventType of eventTypes) {
        const trigger = await this.createHookTrigger({
          hookId: hook.id,
          headers: this.app.companyHeader(companyId),
          data: {
            company_id: companyId,
            project_id: projectId,
            hook: {
              api_version: constants.API_VERSION.DEFAULT,
              trigger: {
                resource_name: resourceName,
                event_type: eventType,
              },
            },
          },
        });
        triggerIds.push(trigger.id);
      }

      this.setTriggerIds(triggerIds);
    },
    async deactivate() {
      const {
        companyId,
        projectId,
      } = this;

      const hookId = this.getHookId();
      const triggerIds = this.getTriggerIds();

      for (const triggerId of triggerIds) {
        await this.deleteHookTrigger({
          hookId,
          triggerId,
          headers: this.app.companyHeader(companyId),
          params: {
            company_id: companyId,
            project_id: projectId,
          },
        });
      }

      await this.deleteHook({
        hookId,
        headers: this.app.companyHeader(companyId),
        params: {
          company_id: companyId,
          project_id: projectId,
        },
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    const dataToEmit = await this.getDataToEmit(body);
    const meta = this.getMeta(dataToEmit);

    this.$emit(dataToEmit, meta);
  },
};
