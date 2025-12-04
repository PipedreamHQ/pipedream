import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-ticket-statuses",
  name: "List Ticket Statuses",
  description: "List the ticket statuses available for your company. [See the documentation](https://dev.frontapp.com/reference/list-company-ticket-statuses)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
  },
  async run({ $ }) {
    const { _results: results } = await this.frontApp.listTicketStatuses({
      $,
    });

    $.export("$summary", `Successfully retrieved ${results.length} ticket status${results.length === 1
      ? ""
      : "es"}`);
    return results;
  },
};
