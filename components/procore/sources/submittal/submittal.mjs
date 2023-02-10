import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Submittal Event (Instant)",
  key: "procore-submittal",
  description: "Emit new event each time a Submittal is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getSubmittal({
      projectId, submittalId, ...args
    }) {
      return this.app.makeRequest({
        path: `/projects/${projectId}/submittals/${submittalId}`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.SUBMITTALS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      const resource =
        await this.getSubmittal({
          projectId,
          submittalId: resourceId,
          headers: this.app.companyHeader(companyId),
        });
      return {
        ...body,
        resource,
      };
    },
    getMeta({
      id, event_type, timestamp, resource,
    }) {
      const {
        title, id: submittalId,
      } = resource;
      const eventType = event_type;
      const summary = title
        ? `${eventType} ${title}`
        : `${eventType} Submittal ID:${submittalId}`;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
