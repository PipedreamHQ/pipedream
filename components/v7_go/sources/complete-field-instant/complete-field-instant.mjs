import { axios } from "@pipedream/platform";
import v7Go from "../../v7_go.app.mjs";

export default {
  key: "v7_go-complete-field-instant",
  name: "Field Completion Event in V7 Go",
  description: "Emit new event when a field within an entity is completed in V7 Go. [See the documentation](https://docs.go.v7labs.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    v7Go,
    db: "$.service.db",
    entityId: {
      propDefinition: [
        v7Go,
        "entityId",
      ],
    },
    fieldName: {
      propDefinition: [
        v7Go,
        "fieldName",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitFieldCompletionEvents();
    },
    async activate() {
      // Logic to create a webhook subscription if needed
    },
    async deactivate() {
      // Logic to delete a webhook subscription if needed
    },
  },
  methods: {
    async emitFieldCompletionEvents() {
      const {
        entityId, fieldName,
      } = this;
      const events = await this.v7Go.emitFieldCompletionEvent({
        entityId,
        fieldName,
      });

      events.slice(0, 50).forEach((event) => {
        this.$emit(event, {
          id: event.id || event.ts,
          summary: `Field ${event.fieldName} completed for entity ${event.entityId}`,
          ts: event.ts || Date.now(),
        });
      });
    },
  },
  async run() {
    await this.emitFieldCompletionEvents();
  },
};
