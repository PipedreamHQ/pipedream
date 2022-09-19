import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Agent Reply",
  version: "0.0.1",
  key: "supportbee-new-agent-reply",
  description: "Emit new event on each new agent reply a ticket.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (!data.agent_replies_count) return;

      this.$emit(data, {
        id: `${data.id}-${data.agent_replies_count}`,
        summary: `New agent reply on ticket id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getResources(args = {}) {
      return this.supportbee.getTickets({
        params: {
          replies: true,
          ...args.params,
        },
      });
    },
  },
};
