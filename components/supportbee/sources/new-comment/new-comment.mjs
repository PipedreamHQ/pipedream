import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Comment",
  version: "0.0.1",
  key: "supportbee-new-comment",
  description: "Emit new event on each new comment.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    ticketId: {
      propDefinition: [
        common.props.supportbee,
        "ticketId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New comment with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    getResources(args = {}) {
      return this.supportbee.getTicketComments({
        ticketId: this.ticketId,
        ...args,
      });
    },
  },
};
