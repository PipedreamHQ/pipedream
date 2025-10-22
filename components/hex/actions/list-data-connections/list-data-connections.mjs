import hex from "../../hex.app.mjs";

export default {
  key: "hex-list-data-connections",
  name: "List Data Connections",
  description: "List all data connections. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/ListDataConnections)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort the data connections by a field.",
      options: [
        "CREATED_AT",
        "NAME",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort the data connections by a field.",
      options: [
        "ASC",
        "DESC",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.hex.paginate({
      $,
      maxResults: this.maxResults,
      fn: this.hex.listDataConnections,
      params: {
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
      },
    });

    const results = [];
    for await (const item of response) {
      results.push(item);
    }

    $.export("$summary", `Successfully listed ${results.length} data connection${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
