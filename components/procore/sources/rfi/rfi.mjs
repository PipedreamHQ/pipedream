import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New RFI Event (Instant)",
  key: "procore-rfi",
  description: "Emit new event each time a RFI is created, updated, or deleted in a project.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getRFI({
      projectId, rfiId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/projects/${projectId}/rfis/${rfiId}`,
        ...args,
      });
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.RFIS;
    },
    async getDataToEmit(body) {
      const {
        companyId,
        projectId,
      } = this;
      const { resource_id: resourceId } = body;
      const resource =
        await this.getRFI({
          projectId,
          rfiId: resourceId,
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
      const { subject } = resource;
      const eventType = event_type;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${subject}`,
        ts,
      };
    },
  },
};
