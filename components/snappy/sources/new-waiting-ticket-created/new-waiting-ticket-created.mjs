import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Waiting Ticket Created",
  version: "0.0.1",
  key: "snappy-new-waiting-ticket-created",
  description: "Emit new event on each new waiting ticket is created.",
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
        summary: `New waiting ticket created with ID ${data.id}`,
        ts: data.created_at,
      });
    },
    async getResources(args = {}) {
      return this.snappy.getWaitingTickets(args);
    },
  },
};
