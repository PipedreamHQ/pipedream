import workflowy from "../../workflowy.app.mjs";

export default {
  key: "workflowy-search-nodes",
  name: "Search Nodes",
  description: "Searches all WorkFlowy nodes by keyword. WorkFlowy has no dedicated search endpoint, so this exports all nodes (GET /api/v1/nodes-export) and filters client-side by matching the query against each node's name and note. Use this to discover node IDs before running **Create Node** (as a parent) or **Update Node**. Note: the export endpoint is rate limited to 1 request per minute. Returns matching nodes with their IDs and content. [See the documentation](https://beta.workflowy.com/api-reference/#nodes-export).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    workflowy,
    query: {
      type: "string",
      label: "Query",
      description: "Keyword to match (case-insensitive) against each node's name and note.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of matching nodes to return. Min 1, max 1000. Defaults to 100.",
      min: 1,
      max: 1000,
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.workflowy.exportNodes({
      $,
    });
    const nodes = response?.nodes ?? [];
    const lowerQuery = String(this.query).toLowerCase();
    const maxResults = this.maxResults ?? 100;

    const matches = nodes
      .filter((node) => {
        const name = (node.name ?? "").toLowerCase();
        const note = (node.note ?? "").toLowerCase();
        return name.includes(lowerQuery) || note.includes(lowerQuery);
      })
      .slice(0, maxResults);

    $.export("$summary", `Found ${matches.length} node${matches.length === 1
      ? ""
      : "s"} matching "${this.query}"`);
    return matches;
  },
};
