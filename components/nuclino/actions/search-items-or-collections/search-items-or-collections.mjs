import nuclino from "../../nuclino.app.mjs";

export default {
  key: "nuclino-search-items-or-collections",
  name: "Search Items or Collections",
  description: "Search for items or collections in Nuclino. [See the documentation](https://help.nuclino.com/fa38d15f-items-and-collections)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nuclino,
    workspaceId: {
      propDefinition: [
        nuclino,
        "workspaceId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query used to search for items and collections",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.nuclino.paginate({
      fn: this.nuclino.listItems,
      params: {
        workspaceId: this.workspaceId,
        search: this.query,
      },
      max: this.maxResults,
    });

    const items = [];
    for await (const item of results) {
      items.push(item);
    }

    $.export("$summary", `Found ${items.length} item${items.length === 1
      ? ""
      : "s"} matching query`);
    return items;
  },
};
