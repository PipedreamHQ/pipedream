import common from "../common/common.mjs";

export default {
  ...common,
  key: "mojo_helpdesk-new-ticket-created",
  name: "New Ticket Created",
  description: "Emit new event when a new ticket is created",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    /*    generateMeta(ticket) {

    }, */
  },
  async run() {
    const tickets = await this.mojoHelpdesk.listTickets(); console.log(tickets);
  },
};
