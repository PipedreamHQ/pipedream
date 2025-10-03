import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "clarify-new-company-instant",
  name: "New Company (Instant)",
  description: "Emit new event when a new company is created. [See the documentation](https://api.getclarify.ai/swagger#/default/createWebhook).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return constants.OBJECT_ENTITY.COMPANY;
    },
    getEventType() {
      return events.CREATE;
    },
    generateMeta(resource) {
      return {
        id: resource._id,
        summary: `New Company ${resource.name}`,
        ts: Date.parse(resource._created_at),
      };
    },
  },
};
