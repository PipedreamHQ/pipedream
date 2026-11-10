import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-human-requested",
  name: "Human Requested",
  description:
    "Emit new event when a visitor asks for a person, or leaves a follow-up for one, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "conversation.handoff_requested";
    },
    getPath() {
      return "/conversations";
    },
    getIdKey() {
      return "conversationId";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Human Requested";
    },
  },
};
