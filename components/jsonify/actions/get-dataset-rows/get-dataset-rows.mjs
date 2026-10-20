import jsonify from "../../jsonify.app.mjs";

export default {
  key: "jsonify-get-dataset-rows",
  name: "Get Dataset Rows",
  description: "Returns rows from a Jsonify dataset. Rows are the latest published output of a maintained pipeline. [See the documentation](https://www.jsonify.com/docs/datasets/query-and-export)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jsonify,
    serveUrl: {
      propDefinition: [
        jsonify,
        "serveUrl",
      ],
    },
    columns: {
      propDefinition: [
        jsonify,
        "columns",
      ],
    },
    filters: {
      propDefinition: [
        jsonify,
        "filters",
      ],
    },
    version: {
      propDefinition: [
        jsonify,
        "version",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of rows to return. Leave empty to return all matching rows.",
      optional: true,
    },
  },
  async run({ $ }) {
    const rows = [];
    let meta;
    for await (const {
      row, page,
    } of this.jsonify.paginate({
      $,
      serveUrl: this.serveUrl,
      max: this.maxResults,
      columns: this.columns,
      filters: this.filters,
      version: this.version,
    })) {
      meta ??= {
        dataset: page.dataset,
        dataset_name: page.dataset_name,
        table: page.table,
        version: page.version,
        updated_at: page.updated_at,
      };
      rows.push(row);
    }

    $.export("$summary", `Successfully retrieved ${rows.length} row${rows.length === 1
      ? ""
      : "s"}`);
    return {
      ...meta,
      row_count: rows.length,
      rows,
    };
  },
};
