import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "webvizio-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the documentation](https://webvizio.com/help-center/outgoing-webhooks/)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PROJECT_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Project: ${resource.name}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
