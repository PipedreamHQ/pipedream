import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "formaloo-row-updated-instant",
  name: "Row Updated (Instant)",
  description: "Emit new event when a row is updated. [See the documentation](https://help.formaloo.com/en/articles/8568748-how-formaloo-webhook-works).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getData() {
      return {
        row_update_events: true,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.event_id,
        summary: `Row Updated: ${resource.event_id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
