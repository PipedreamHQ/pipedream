import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vida-new-conversation-instant",
  name: "New Conversation (Instant)",
  description: "Emit new events after completion of any communication handled by your Vida AI agent, be it a call, text, or email.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New conversation created: ${event.uuid}`;
    },
  },
  sampleEmit,
};
