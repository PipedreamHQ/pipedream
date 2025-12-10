import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-list-agents",
  name: "List Agents",
  description: "List all available Cursor agents. [See the documentation](https://cursor.com/docs/cloud-agent/api/endpoints#list-agents)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cursor,
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of agents to return",
      optional: true,
      max: 100,
    },
    paginationCursor: {
      type: "string",
      label: "Pagination Cursor",
      description: "The cursor returned from a previous request to use for pagination",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cursor.listAgents({
      $,
      params: {
        limit: this.limit,
        cursor: this.paginationCursor,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.agents.length} agent${response.agents.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
