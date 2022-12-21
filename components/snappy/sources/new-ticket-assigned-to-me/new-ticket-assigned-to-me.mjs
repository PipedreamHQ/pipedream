import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Ticket Assigned To Me",
  version: "0.0.1",
  key: "snappy-new-ticket-assigned-to-me",
  description: "Emit new event when a new ticket is assigned to me.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    mailboxId: {
      propDefinition: [
        common.props.snappy,
        "mailboxId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New ticket assigned to me with ID ${data.id}`,
        ts: data.created_at,
      });
    },
    async getResources(args = {}) {
      return this.snappy.getTicketsAssignedToMe(args);
    },
  },
};
