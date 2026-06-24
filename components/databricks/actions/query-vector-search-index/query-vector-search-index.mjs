import {
  VECTOR_SEARCH_MAX_RESULTS, VECTOR_SEARCH_PAGE_LIMIT,
} from "../../common/constants.mjs";
import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-query-vector-search-index",
  name: "Query Vector Search Index",
  description: "Query a specific vector search index in Databricks. Returns up to **Max Results** items; when the result set spans more than one 1000-item page, the action automatically follows `next_page_token` to collect the rest. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/queryindex)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    columns: {
      type: "string[]",
      label: "Columns",
      description: "List of column names to include in the response. Example: `[\"id\"]`",
    },
    queryText: {
      type: "string",
      label: "Query Text",
      description: "Free-text query for semantic search.",
      optional: true,
    },
    queryVector: {
      type: "string",
      label: "Query Vector",
      description: "JSON array of floats representing the embedding vector for the query.",
      optional: true,
    },
    filtersJson: {
      type: "string",
      label: "Filters JSON",
      description: "JSON string representing query filters. Example: `{ \"id <\": 5 }`",
      optional: true,
    },
    includeEmbeddings: {
      type: "boolean",
      label: "Include Embeddings",
      description: "Whether to include the embedding vectors in the results.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Total number of results to return.",
      optional: true,
      default: 10,
      min: 1,
      max: VECTOR_SEARCH_MAX_RESULTS,
    },
  },

  async run({ $ }) {
    const maxResults = Math.min(this.maxResults, VECTOR_SEARCH_MAX_RESULTS);
    const payload = {
      columns: this.columns,
      // num_results is the TOTAL the query returns (not a per-page cap). The API
      // pages results into 1000-item groups with a next_page_token when the total
      // exceeds 1000; the loop below follows those tokens.
      num_results: maxResults,
    };

    if (this.queryText) payload.query_text = this.queryText;

    if (this.queryVector) {
      try {
        payload.query_vector = JSON.parse(this.queryVector);
        if (
          !Array.isArray(payload.query_vector) ||
          payload.query_vector.length === 0 ||
          !payload.query_vector.every((n) => typeof n === "number" && Number.isFinite(n))
        ) {
          throw new Error("`queryVector` must be a non-empty JSON array of finite numbers.");
        }
      } catch (err) {
        throw new Error(`Invalid queryVector JSON: ${err.message}`);
      }
    }

    if (this.filtersJson) {
      payload.filters_json = this.filtersJson;
    }

    if (this.includeEmbeddings !== undefined) {
      payload.include_embeddings = this.includeEmbeddings;
    }

    const response = await this.databricks.queryVectorSearchIndex({
      indexName: this.indexName,
      data: payload,
      $,
    });

    const dataArray = response?.result?.data_array
      ? [
        ...response.result.data_array,
      ]
      : [];
    let pageToken = response?.next_page_token;
    let lastPageCount = dataArray.length;

    // Each call returns at most VECTOR_SEARCH_PAGE_LIMIT (1000) items plus a
    // next_page_token while more remain. Keep paging through the dedicated
    // query-next-page endpoint until we have maxResults items, the token runs
    // out, or a short page (< 1000) signals the end of results.
    while (pageToken
      && (dataArray.length < maxResults)
      && (lastPageCount >= VECTOR_SEARCH_PAGE_LIMIT)
    ) {
      const nextResponse = await this.databricks.queryVectorSearchIndexNextPage({
        indexName: this.indexName,
        data: {
          endpoint_name: this.endpointName,
          page_token: pageToken,
        },
        $,
      });
      const rows = nextResponse?.result?.data_array ?? [];
      dataArray.push(...rows);
      lastPageCount = rows.length;
      pageToken = nextResponse?.next_page_token;
    }

    if (dataArray.length > maxResults) {
      dataArray.length = maxResults;
    }

    const result = {
      ...response,
      result: {
        ...response?.result,
        data_array: dataArray,
      },
      next_page_token: pageToken || "",
    };

    $.export("$summary", `Retrieved ${dataArray.length} results from index ${this.indexName}`);

    return result;
  },
};
