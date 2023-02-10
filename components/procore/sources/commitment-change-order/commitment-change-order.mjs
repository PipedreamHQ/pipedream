import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Commitment Change Order Event (Instant)",
  key: "procore-commitment-change-order",
  description: "Emit new event each time a Commitment Change Order is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getChangeEvent({
      changeEventId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/change_events/${changeEventId}`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.CHANGE_EVENTS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      const resource =
        await this.getChangeEvent({
          changeEventId: resourceId,
          headers: this.app.companyHeader(companyId),
          params: {
            project_id: projectId,
          },
        });
      return {
        ...body,
        resource,
      };
    },
    getMeta(body) {
      const {
        id,
        event_type: eventType,
        resource_id: resourceId,
        timestamp,
      } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} Change Order ID:${resourceId}`,
        ts,
      };
    },
  },
};
