import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clarify-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created. [See the documentation](https://api.getclarify.ai/swagger#/default/createWebhook).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return constants.OBJECT_ENTITY.PERSON;
    },
    getEventType() {
      return events.CREATE;
    },
    generateMeta(resource) {
      return {
        id: resource._id,
        summary: `New Person ${resource.name.first_name}`,
        ts: Date.parse(resource._created_at),
      };
    },
  },
  sampleEmit,
};
