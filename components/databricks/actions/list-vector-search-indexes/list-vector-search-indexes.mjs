import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-vector-search-indexes",
  name: "List Vector Search Indexes",
  description: "Lists all vector search indexes in the workspace. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/listindexes)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    endpointName: {
      propDefinition: [
        databricks,
        "endpointName",
      ],
    },
  },

  async run({ $ }) {
    const allIndexes = [];
    let pageToken;

    do {
      const {
        vector_indexes, next_page_token,
      } = await this.databricks.listVectorSearchIndexes({
        params: {
          endpoint_name: this.endpointName,
          ...(pageToken
            ? {
              page_token: pageToken,
            }
            : {}),
        },
        $,
      });

      if (vector_indexes?.length) {
        allIndexes.push(...vector_indexes);
      }

      pageToken = next_page_token;
    } while (pageToken);

    $.export(
      "$summary",
      `Successfully retrieved ${allIndexes.length} index${allIndexes.length === 1
        ? ""
        : "es"}.`,
    );

    return allIndexes;
  },
};
