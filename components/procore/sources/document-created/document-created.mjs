import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "New Document Created (Instant)",
  key: "procore-document-created",
  description: "Emit new event each time a new document is created.",
  version: "0.1.0",
  type: "source",
  methods: {
    ...common.methods,
    getComponentEventTypes() {
      return [
        constants.EVENT_TYPES.CREATE.value,
      ];
    },
    getResourceName() {
      return constants.RESOURCE_NAMES.DOCUMENTS;
    },
    getDataToEmit(body) {
      return body;
    },
    getMeta(body) {
      const {
        id,
        event_type: eventType,
        resource_name: resourceName,
        timestamp,
      } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${resourceName}`,
        ts,
      };
    },
  },
};
