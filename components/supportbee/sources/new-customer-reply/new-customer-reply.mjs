import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Customer Reply",
  version: "0.0.1",
  key: "supportbee-new-customer-reply",
  description: "Emit new event on each new customer reply a ticket.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (data.replies_count - data.agent_replies_count <= 0) return;

      this.$emit(data, {
        id: `${data.id}-${data.replies_count - data.agent_replies_count}`,
        summary: `New agent reply on ticket id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getResources({ ...args } = {}) {
      return this.supportbee.getTickets({
        params: {
          replies: true,
          ...args.params,
        },
      });
    },
  },
};
