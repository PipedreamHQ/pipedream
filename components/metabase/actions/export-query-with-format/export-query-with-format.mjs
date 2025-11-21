import app from "../../metabase.app.mjs";

export default {
  key: "metabase-export-query-with-format",
  name: "Export Query with Format",
  description: "Execute a saved question/card with parameters and export results in the specified format (CSV, JSON, XLSX, or API). [See the documentation](https://www.metabase.com/docs/latest/api#tag/apicard/post/api/card/%7Bcard-id%7D/query).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    cardId: {
      propDefinition: [
        app,
        "cardId",
      ],
    },
    exportFormat: {
      type: "string",
      label: "Export Format",
      description: "The format to export the query results in",
      options: [
        {
          label: "CSV",
          value: "csv",
        },
        {
          label: "JSON",
          value: "json",
        },
        {
          label: "XLSX",
          value: "xlsx",
        },
        {
          label: "API",
          value: "api",
        },
      ],
    },
    formatRows: {
      type: "boolean",
      label: "Format Rows",
      description: "Whether to format rows for display",
      optional: true,
      default: false,
    },
    pivotResults: {
      type: "boolean",
      label: "Pivot Results",
      description: "Whether to pivot the results",
      optional: true,
      default: false,
    },
    parameters: {
      type: "string[]",
      label: "Parameters",
      description: "Query parameters as JSON objects. Each parameter should be a JSON string with the parameter properties. Example: `{\"type\": \"category\", \"target\": [\"variable\", [\"template-tag\", \"parameter_name\"]], \"value\": \"your_value\"}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      cardId,
      exportFormat,
      formatRows,
      pivotResults,
      parameters,
    } = this;

    // Parse parameters from JSON strings to objects
    const parsedParameters = parameters?.map((param, index) => {
      if (typeof param === "string") {
        try {
          return JSON.parse(param);
        } catch (error) {
          throw new Error(`Invalid JSON in parameter at index ${index}: ${error.message}`);
        }
      }
      return param;
    });

    const response = await app.exportCardQuery({
      $,
      cardId,
      exportFormat,
      data: {
        format_rows: formatRows,
        pivot_results: pivotResults,
        ...(parsedParameters && parsedParameters.length > 0 && {
          parameters: parsedParameters,
        }),
      },
    });

    $.export("$summary", `Successfully exported query results as ${exportFormat.toUpperCase()}`);

    return response;
  },
};
