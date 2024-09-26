import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "webvizio-project-updated",
  name: "Project Updated",
  description: "Emit new event when a project is updated. [See the documentation](https://webvizio.com/help-center/outgoing-webhooks/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PROJECT_UPDATED;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updatedAt);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Project Updated: ${resource.name}`,
        ts,
      };
    },
  },
};
