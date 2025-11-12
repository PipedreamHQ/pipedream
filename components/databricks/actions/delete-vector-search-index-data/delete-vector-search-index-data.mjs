import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "databricks-delete-vector-search-index-data",
  name: "Delete Data from Vector Search Index",
  description:
    "Deletes rows from a Direct Access vector index by primary-key values. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/deletedatavectorindex)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    primaryKeys: {
      type: "string[]",
      label: "Primary Keys",
      description:
        "Values of the index’s primary key column to delete (e.g. `1`, `2`). These are the values for the column you set as `primary_key` when the index was created.",
    },
  },
  async run({ $ }) {
    const parsedKeys = utils.parseObject(this.primaryKeys);

    const keys = (Array.isArray(parsedKeys)
      ? parsedKeys
      : [
        parsedKeys,
      ])
      .map((s) => String(s).trim())
      .filter(Boolean);

    if (!keys.length) {
      throw new Error("Please provide at least one primary key to delete.");
    }

    const response = await this.databricks.deleteVectorSearchData({
      indexName: this.indexName,
      params: {
        primary_keys: keys,
      },
      $,
    });

    $.export(
      "$summary",
      `Requested delete of ${keys.length} row(s) from index "${this.indexName}".`,
    );
    return response;
  },
};
