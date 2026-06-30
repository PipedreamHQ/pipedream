import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-query-vector-search-index-next-page",
  name: "Query Vector Search Index Next Page",
  description: "Fetch the next page of results from a previously executed Databricks Vector Search query, using the `next_page_token` returned by a prior call. Run **Query Vector Search Index** first to get an initial page and its `next_page_token`, then pass that token here (and again on each subsequent call) to walk through all pages. Results are returned in groups of up to 1000, with a maximum of 10,000 total; an empty `next_page_token` in the response means there are no more pages. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/querynextpage).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    databricks,
    endpointName: {
      propDefinition: [
        databricks,
        "endpointName",
      ],
    },
    indexName: {
      propDefinition: [
        databricks,
        "indexName",
        ({ endpointName }) => ({
          endpointName,
        }),
      ],
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The pagination token to fetch the next page of results. Use the `next_page_token` value returned by a prior **Query Vector Search Index** or **Query Vector Search Index Next Page** call (e.g. `eyJpZCI6MTIzfQ==`).",
    },
  },
  async run({ $ }) {
    const response = await this.databricks.queryVectorSearchIndexNextPage({
      indexName: this.indexName,
      data: {
        endpoint_name: this.endpointName,
        page_token: this.pageToken,
      },
      $,
    });

    const count = response?.result?.data_array?.length ?? 0;
    $.export("$summary", `Retrieved ${count} results from index ${this.indexName}`);

    return response;
  },
};
