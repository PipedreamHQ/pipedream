import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-search-tickets",
  name: "Search Tickets",
  description: "Search for tickets in Freshdesk by keyword. [See the documentation](https://developers.freshdesk.com/api/#filter_tickets)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for tickets. [See the documentation](https://developers.freshdesk.com/api/#filter_tickets). Example: `\"priority:>3 AND group_id:11 AND status:2\"`. Use the **List Ticket Fields** action to get the field names and types.",
    },
  },
  async run({ $ }) {
    const query = this.query.startsWith("\"") && this.query.endsWith("\"")
      ? this.query
      : `"${this.query}"`;
    const response = await this.freshdesk.searchTickets({
      $,
      params: {
        query,
      },
    });
    $.export("$summary", `Successfully found ${response.total} ticket${response.total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
