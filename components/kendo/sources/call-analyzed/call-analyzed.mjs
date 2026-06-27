import base from "../common/webhook-base.mjs";

export default {
  ...base,
  key: "kendo-call-analyzed",
  name: "New Call Analyzed",
  description: "Emit new event when Kendo finishes AI analysis on a call.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEventType() {
      return "call.uploaded";
    },
    getSummary(data) {
      return `Call analyzed: ${data?.agentName ?? "Unknown"} — Score: ${
        data?.aiScore ?? "N/A"
      }`;
    },
  },
};
