import common from "../common/common.mjs";

export default {
  ...common,
  key: "mojo_helpdesk-new-ticket-with-due-date-created",
  name: "New Ticket With Due Date Created",
  description: "Emit new event when a new unassigned ticket with a due date is created. [See the docs](https://github.com/mojohelpdesk/mojohelpdesk-api-doc#all-tickets-with-due-date)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources(params) {
      return this.mojoHelpdesk.searchTickets({
        params: {
          ...params,
          query: "_exists_:due_on",
          sf: this.getSortField(),
          r: 1, // reverse sort (desc)
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
