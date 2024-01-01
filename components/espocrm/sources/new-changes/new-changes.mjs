import espoCrm from "../../espocrm.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "espocrm-new-changes",
  name: "New Changes (Instant)",
  description: "Emit new event upon the creation, update, deletion, or changes of any field in an entity type. [See the documentation](https://docs.espocrm.com/administration/webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    espoCrm,
    db: "$.service.db",
    http: "$.interface.http",
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The entity type to watch. The list of available entity types can be obtained at Administration > Entity Manager.",
    },
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Watch for this event type from the specified entity",
      options: constants.EVENT_TYPES,
      optional: true,
    },
    field: {
      type: "string",
      label: "Field",
      description: "Watch for changes to a specific field. The list of available fields can be obtained at Administration > Entity Manager > fields.",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      if ((!this.eventType && !this.field) || (this.eventType && this.field)) {
        throw new ConfigurationError("One of `Entity Type` or `Field` must be entered.");
      }
      const { id } = await this.espoCrm.createWebhook({
        data: {
          url: this.http.endpoint,
          event: this.field
            ? `${this.entityType}.fieldUpdate.${this.field}`
            : `${this.entityType}.${this.eventType}`,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.espoCrm.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run(event) {
    const { body } = event;
    const ts = Date.now();
    this.$emit(body, {
      id: ts,
      summary: "New Event Received",
      ts,
    });
  },
};
