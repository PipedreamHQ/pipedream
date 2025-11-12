import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloze-company-change-instant",
  name: "Company Change (Instant)",
  description: "Emit new event when significant changes regarding a company are detected. [See the documentation](https://api.cloze.com/api-docs/#!/Webhooks/post_v1_subscribe).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.COMPANY_CHANGE;
    },
    generateMeta(event) {
      return {
        id: event?.company.syncKey,
        summary: "New Company Change",
        ts: event?.company.lastChanged,
      };
    },
  },
  sampleEmit,
};
