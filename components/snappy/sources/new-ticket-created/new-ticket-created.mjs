import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Ticket Create",
  version: "0.0.1",
  key: "snappy-new-ticket-created",
  description: "Emit new event on each new ticket created.",
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
        summary: `New ticket created with ID ${data.id}`,
        ts: data.created_at,
      });
    },
    async getResources(args = {}) {
      return this.snappy.getInboxTickets(args);
    },
  },
};
