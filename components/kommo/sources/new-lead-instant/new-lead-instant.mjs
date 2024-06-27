import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kommo-new-lead-instant",
  name: "New Lead (Instant)",
  description: "Emit new event when a lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "add_lead",
      ];
    },
    generateMeta(body) {
      return {
        id: body["leads[add][0][id]"],
        summary: `New Lead: ${body["leads[add][0][name]"]}`,
        ts: Date.parse(body["leads[add][0][created_at]"]),
      };
    },
  },
  sampleEmit,
};
