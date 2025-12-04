import common from "../common/base.mjs";

export default {
  ...common,
  key: "help_scout-new-agent-reply-instant",
  name: "New Agent Reply (Instant)",
  description: "Emit new event when an agent replies to a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.agent.reply.created",
      ];
    },
    getSummary(body) {
      const agentName = body.assignee
        ? `${body.assignee.firstName} ${body.assignee.lastName}`
        : "Agent";
      return `New agent reply from ${agentName} in conversation: ${body.subject}`;
    },
  },
};
