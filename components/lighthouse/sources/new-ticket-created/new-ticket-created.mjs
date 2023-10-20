import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Ticket Created",
  version: "0.0.1",
  key: "lighthouse-new-ticket-created",
  description: "Emit new event for each new ticket created.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.lighthouse,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent({ ticket }) {
      this.$emit(ticket, {
        id: ticket.number,
        summary: `New ticket created with number ${ticket.number}`,
        ts: Date.parse(ticket.created_at),
      });
    },
    async getResources(args = {}) {
      const { tickets } = await this.lighthouse.getTickets({
        ...args,
        projectId: this.projectId,
      });

      return tickets ?? [];
    },
    resourceKey() {
      return "ticket";
    },
  },
};
