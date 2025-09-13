import databricks from "../../databricks.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "databricks-create-vector-search-index",
  name: "Create Vector Search Index",
  description:
    "Creates a new vector search index in Databricks. [See the documentation](https://docs.databricks.com/api/workspace/vectorsearchindexes/createindex)",
  version: "0.0.1",
  type: "action",
  props: {
    databricks,
    name: {
      type: "string",
      label: "Index Name",
      description:
        "A unique name for the index (e.g., `main_catalog.docs.en_wiki_index`).",
    },
    endpointName: {
      propDefinition: [
        databricks,
        "endpointName",
      ],
    },
    indexType: {
      type: "string",
      label: "Index Type",
      description: "Type of index (`DELTA_SYNC` or `DIRECT_ACCESS`).",
      options: [
        "DELTA_SYNC",
        "DIRECT_ACCESS",
      ],
    },
    primaryKey: {
      type: "string",
      label: "Primary Key",
      description: "The primary key column for the index.",
    },
    sourceTable: {
      type: "string",
      label: "Source Table",
      description:
        "The Delta table backing the index (required for `DELTA_SYNC`).",
      optional: true,
    },
    columnsToSync: {
      type: "string[]",
      label: "Columns to Sync",
      description:
        "List of columns to sync from the source Delta table. Example: `[\"id\", \"text\"]` (required for `DELTA_SYNC`).",
      optional: true,
    },
    embeddingSourceColumns: {
      type: "string[]",
      label: "Embedding Source Columns",
      description:
        "List of embedding source column configs. Each entry should be a JSON object string like `[ { \"embedding_model_endpoint_name\": \"e5-small-v2\", \"name\": \"text\" } ]` (required for `DELTA_SYNC`).",
      optional: true,
    },
    schemaJson: {
      type: "string",
      label: "Schema JSON",
      description:
        "The schema of the index in JSON format. Example: `{ \"columns\": [{ \"name\": \"id\", \"type\": \"string\" }, { \"name\": \"text_vector\", \"type\": \"array<double>\" }] }`. Required for `DIRECT_ACCESS` indexes.",
      optional: true,
    },
    pipelineType: {
      type: "string",
      label: "Pipeline Type",
      description: "Pipeline type for syncing (default: TRIGGERED).",
      options: [
        "TRIGGERED",
        "CONTINUOUS",
      ],
      optional: true,
      default: "TRIGGERED",
    },
  },

  async run({ $ }) {
    const payload = {
      name: this.name,
      endpoint_name: this.endpointName,
      index_type: this.indexType,
      primary_key: this.primaryKey,
    };

    if (this.indexType === "DELTA_SYNC") {
      if (!this.sourceTable) {
        throw new ConfigurationError(
          "sourceTable is required when indexType is DELTA_SYNC.",
        );
      }

      const columnsToSync = Array.isArray(this.columnsToSync)
        ? this.columnsToSync
        : utils.parseObject(this.columnsToSync);

      const embeddingSourceColumns = Array.isArray(this.embeddingSourceColumns)
        ? this.embeddingSourceColumns.map((item, idx) => {
          if (typeof item === "string") {
            try {
              return JSON.parse(item);
            } catch (e) {
              throw new ConfigurationError(
                `embeddingSourceColumns[${idx}] is not valid JSON: ${e.message}`,
              );
            }
          }
          return item;
        })
        : utils.parseObject(this.embeddingSourceColumns);

      if (!Array.isArray(columnsToSync) || !columnsToSync.length) {
        throw new ConfigurationError(
          "columnsToSync must be a non-empty array for DELTA_SYNC indexes.",
        );
      }
      if (!Array.isArray(embeddingSourceColumns) || !embeddingSourceColumns.length) {
        throw new ConfigurationError(
          "embeddingSourceColumns must be a non-empty array for DELTA_SYNC indexes.",
        );
      }

      payload.delta_sync_index_spec = {
        source_table: this.sourceTable,
        pipeline_type: this.pipelineType || "TRIGGERED",
        columns_to_sync: columnsToSync,
        embedding_source_columns: embeddingSourceColumns,
      };
    }

    else if (this.indexType === "DIRECT_ACCESS") {
      if (!this.schemaJson) {
        throw new ConfigurationError(
          "schemaJson is required when indexType is DIRECT_ACCESS.",
        );
      }
      payload.direct_access_index_spec = {
        schema_json: this.schemaJson,
      };
    }

    const response = await this.databricks.createVectorSearchIndex({
      data: payload,
      $,
    });

    $.export(
      "$summary",
      `Successfully created vector search index: ${response?.name || this.name}`,
    );
    return response;
  },
};
