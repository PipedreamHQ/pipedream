import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "paymo-new-client-created",
  name: "New Client Created",
  description: "Emit new event when a new client is created. [See the docs](https://github.com/paymoapp/api/blob/master/sections/webhooks.md#events).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.CLIENT.INSERT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Client: ${resource.name}`,
        ts: Date.parse(resource.created_on),
      };
    },
  },
};
