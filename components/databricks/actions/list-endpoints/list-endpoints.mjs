import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-endpoints",
  name: "List Endpoints",
  description: "List all vector search endpoints. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchendpoints/listendpoints)",
  version: "0.0.2",
  type: "action",
  props: {
    databricks,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of endpoints to return",
      default: 100,
    },
  },
  async run({ $ }) {
    const allEndpoints = [];
    const params = {};

    do {
      const {
        endpoints, next_page_token,
      } = await this.databricks.listEndpoints({
        params,
        $,
      });

      allEndpoints.push(...endpoints);
      if (!next_page_token) break;
      params.page_token = next_page_token;
    } while (allEndpoints.length < this.maxResults);

    if (allEndpoints.length > this.maxResults) {
      allEndpoints.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${allEndpoints.length} endpoint${allEndpoints.length === 1
      ? ""
      : "s"}.`);

    return allEndpoints;
  },
};
