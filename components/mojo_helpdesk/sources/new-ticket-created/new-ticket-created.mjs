import common from "../common/common.mjs";

export default {
  ...common,
  key: "mojo_helpdesk-new-ticket-created",
  name: "New Ticket Created",
  description: "Emit new event when a new ticket is created. [See the docs here](https://github.com/mojohelpdesk/mojohelpdesk-api-doc#list-tickets)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources(params) {
      return this.mojoHelpdesk.listTickets({
        params: {
          ...params,
          sort_by: this.getSortField(),
          sort_order: "desc",
        },
      });
    },
    getSortField() {
      return "created_on";
    },
    generateMeta({
      id, title, created_on: createdOn,
    }) {
      return {
        id,
        summary: title,
        ts: Date.parse(createdOn),
      };
    },
  },
};
