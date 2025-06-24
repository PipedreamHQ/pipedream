import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "clarify-company-added-to-list-instant",
  name: "Company Added To List (Instant)",
  description: "Emit new event when a company is added to a list. [See the documentation](https://api.getclarify.ai/swagger#/default/createWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return constants.OBJECT_ENTITY.COMPANY;
    },
    getEventType() {
      return events.UPDATE;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
