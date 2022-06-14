import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-all-tickets",
  name: "List All Tickets",
  description: "Use filters to view only specific tickets (those which match the criteria that you choose). By default, only tickets that have not been deleted or marked as spam will be returned, unless you use the 'deleted' filter.",
  version: "0.1.2",
  type: "action",
  props: {
    freshdesk,
  },
  async run({ $ }) {
    const response = await this.freshdesk.getTickets($);
    response?.length && $.export("$summary", "Tickets listed successfully");
    return response;
  },
};
