import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-vector-search-indexes",
  name: "List Vector Search Indexes",
  description: "Lists all vector search indexes in the workspace. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/listindexes)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
  },

  async run({ $ }) {
    const response = await this.databricks.listVectorSearchIndexes({
      $,
    });

    const count = response?.vector_indexes?.length || 0;
    $.export("$summary", `Found ${count} vector search index${count === 1
      ? ""
      : "es"}`);

    return response;
  },
};
