import common from "../common/base.mjs";

export default {
  ...common,
  key: "agile_crm-new-ticket",
  name: "New Ticket",
  description: "Emit new event when a new ticket is created",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    filter: {
      propDefinition: [
        common.props.agileCrm,
        "filter",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.agileCrm.listTickets.bind(this);
    },
    getParams() {
      return {
        filter_id: this.filter,
      };
    },
    generateMeta(ticket) {
      return {
        id: ticket.id,
        summary: ticket.subject,
        ts: ticket.created_time,
      };
    },
  },
};
