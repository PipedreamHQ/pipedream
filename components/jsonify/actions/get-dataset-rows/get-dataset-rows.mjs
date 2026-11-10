import jsonify from "../../jsonify.app.mjs";

export default {
  key: "jsonify-get-dataset-rows",
  name: "Get Dataset Rows",
  description: "Returns rows from a Jsonify dataset, with its name, version and last update time. Rows are the latest published output of a scheduled, self-repairing pipeline, so use this instead of scraping when the data is already maintained in Jsonify. Filter by exact column values and pick columns to keep the result small. [See the documentation](https://www.jsonify.com/docs/datasets/query-and-export)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      description: "Maximum number of rows to return, e.g. `100`. Leave empty to return all matching rows.",
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

    if (!meta) {
      const head = await this.jsonify.getPage({
        $,
        serveUrl: this.serveUrl,
        limit: 1,
        columns: this.columns,
        filters: this.filters,
        version: this.version,
      });
      meta = {
        dataset: head.dataset,
        dataset_name: head.dataset_name,
        table: head.table,
        version: head.version,
        updated_at: head.updated_at,
      };
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
