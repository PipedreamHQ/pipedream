import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-list-ticket-fields",
  name: "List Ticket Fields",
  description: "List all ticket fields in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#list_all_ticket_fields)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    maxResults: {
      propDefinition: [
        freshdesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.freshdesk.getPaginatedResources({
      fn: this.freshdesk.listTicketFields,
      args: {
        $,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully listed ${results.length} ticket field${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
