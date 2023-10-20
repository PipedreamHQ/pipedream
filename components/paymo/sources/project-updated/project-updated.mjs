import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "paymo-project-updated",
  name: "Project Updated",
  description: "Emit new event when a project is updated. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PROJECT.UPDATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_on);
      return {
        id: ts,
        summary: `Project Updated: ${resource.name}`,
        ts,
      };
    },
  },
};
