import { ConfigurationError } from "@pipedream/platform";
import app from "../../attractwell.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    vaultId: {
      optional: false,
      propDefinition: [
        app,
        "vaultId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        http: { endpoint: hookUrl },
        vaultId,
        getTriggerContext,
        getTriggerName,
        setTriggerContextId,
      } = this;

      const triggerContextId = Date.now();

      await createWebhook({
        data: {
          hookUrl,
          vault_id: vaultId,
          trigger_name: getTriggerName(),
          trigger_context: getTriggerContext(),
          trigger_context_id: triggerContextId,
        },
      });

      setTriggerContextId(triggerContextId);
    },
    async deactivate() {
      const {
        deleteWebhook,
        vaultId,
        getTriggerContextId,
        getTriggerName,
        getTriggerContext,
      } = this;

      await deleteWebhook({
        data: {
          vault_id: vaultId,
          trigger_name: getTriggerName(),
          trigger_context: getTriggerContext(),
          trigger_context_id: getTriggerContextId(),
        },
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getTriggerName() {
      throw new ConfigurationError("getTriggerName is not implemented");
    },
    getTriggerContext() {
      throw new ConfigurationError("getTriggerContext is not implemented");
    },
    setTriggerContextId(value) {
      this.db.set(constants.TRIGGER_CONTEXT_ID, value);
    },
    getTriggerContextId() {
      return this.db.get(constants.TRIGGER_CONTEXT_ID);
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/zapier/trigger",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this.app.delete({
        debug: true,
        path: "/zapier/trigger",
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
