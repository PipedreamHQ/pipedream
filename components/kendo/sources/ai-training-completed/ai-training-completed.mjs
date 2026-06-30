import base from "../common/webhook-base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "kendo-ai-training-completed",
  name: "New AI Training Completed",
  description:
    "Emit new event when Kendo completes an AI training session for an agent.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEventType() {
      return "ai.training.completed";
    },
    getSummary(data) {
      return `AI training completed: ${data?.agentName ?? "Unknown"} — Score: ${
        data?.aiScore ?? "N/A"
      }`;
    },
  },
  sampleEmit,
};
