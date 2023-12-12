import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "loop_returns-return-status-updated-instant",
  name: "Return Status Updated (Instant)",
  description: "Emit new event when the status of a return has been updated. [See the documentation](https://docs.loopreturns.com/reference/return-webhook)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    setReturnState(resource) {
      this.db.set(resource.id, resource.state);
    },
    getReturnState(returnId) {
      return this.db.get(returnId);
    },
    isResourceRelevant(resource) {
      const previousState = this.getReturnState(resource.id);

      if (!previousState) {
        return true;
      }

      return resource.state !== previousState;
    },
    processResource(resource) {
      if (this.isResourceRelevant(resource)) {
        this.setReturnState(resource);
        return this.$emit(resource, this.generateMeta(resource));
      }
      console.log("Skipping irrelevant resource", resource);
    },
    getResourcesFn() {
      return this.app.listReturns;
    },
    getEventData() {
      return {
        url: this.http.endpoint,
        topic: events.TOPIC.RETURN,
        trigger: events.TRIGGER.RETURN_UPDATED,
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Return Status Updated: ${resource.order_name}`,
        ts,
      };
    },
  },
};
