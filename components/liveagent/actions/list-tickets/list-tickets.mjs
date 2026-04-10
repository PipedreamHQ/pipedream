import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-list-tickets",
  name: "List Tickets",
  description: "Lists all tickets. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveagent,
    sortDir: {
      propDefinition: [
        liveagent,
        "sortDir",
      ],
    },
    sortField: {
      propDefinition: [
        liveagent,
        "sortField",
      ],
    },
    filters: {
      propDefinition: [
        liveagent,
        "filters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.listTickets({
      $,
      params: {
        _sortDir: this.sortDir,
        _sortField: this.sortField,
        _filters: this.filters,
      },
    });
    $.export("$summary", `Successfully listed ${response.length} ticket(s).`);
    return response;
  },
};
