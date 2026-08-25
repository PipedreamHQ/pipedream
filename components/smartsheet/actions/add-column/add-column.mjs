// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import {
  COLUMN_TYPES, PICKLIST_COLUMN_TYPES,
} from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-column",
  name: "Add Column",
  description:
    "Add a single column to an existing sheet, at the end or at a chosen position."
    + " Returns the created column under `result`, including its ID."
    + " Use **List Columns** to see the existing columns and their positions first."
    + " To change a column that already exists, use **Update Column**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/columns-addtosheet)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      type: "string",
      label: "Sheet ID",
      description: "The ID of the sheet to add a column to (e.g. `1234567890123456`). Use **List Sheets** to find sheet IDs.",
    },
    title: {
      type: "string",
      label: "Column Title",
      description: "The column title. Must be unique within the sheet.",
    },
    columnType: {
      type: "string",
      label: "Column Type",
      description: "The data type for this column. PICKLIST and MULTI_PICKLIST accept Picklist Options, but the API also creates them with no options (you can add options later with **Update Column**). Note that requesting DATETIME creates an ABSTRACT_DATETIME column, since DATETIME is reserved for system columns. Changing a column's type later can lose data.",
      options: COLUMN_TYPES,
    },
    index: {
      type: "integer",
      label: "Position Index",
      description: "Zero-based position for the new column. If omitted, the column is added at the end. A value past the last column is clamped by the API rather than rejected.",
      min: 0,
      optional: true,
    },
    options: {
      type: "string",
      label: "Picklist Options",
      description:
        "JSON array of option strings for a PICKLIST or MULTI_PICKLIST column. Optional: the API also creates those columns with no options."
        + " Example: `[\"Low\", \"Medium\", \"High\", \"Critical\"]`",
      optional: true,
    },
    validation: {
      type: "boolean",
      label: "Validation",
      description: "Set to `true` to restrict cell values to the picklist options. PICKLIST and MULTI_PICKLIST only.",
      optional: true,
    },
  },
  async run({ $ }) {
    let index = this.index;
    if (index === undefined) {
      const result = await this.smartsheet.listColumns(this.sheetId, {
        $,
        params: {
          includeAll: true,
        },
      });
      index = result.totalCount ?? result.data?.length ?? 0;
    }

    const column = {
      title: this.title,
      type: this.columnType,
      index,
    };
    if (this.options) {
      if (!PICKLIST_COLUMN_TYPES.includes(this.columnType)) {
        throw new ConfigurationError("`Picklist Options` is only supported for PICKLIST and MULTI_PICKLIST columns.");
      }
      let parsedOptions;
      try {
        parsedOptions = JSON.parse(this.options);
      } catch {
        throw new ConfigurationError("`Picklist Options` must be a valid JSON array (e.g. `[\"Low\", \"High\"]`).");
      }
      if (
        !Array.isArray(parsedOptions)
        || !parsedOptions.length
        || parsedOptions.some((v) => typeof v !== "string" || !v.trim())
      ) {
        throw new ConfigurationError("`Picklist Options` must be a non-empty JSON array of non-empty strings.");
      }
      column.options = parsedOptions;
    }
    if (this.validation) {
      if (!PICKLIST_COLUMN_TYPES.includes(this.columnType)) {
        throw new ConfigurationError("`Validation` is only supported for PICKLIST and MULTI_PICKLIST columns.");
      }
      column.validation = this.validation;
    }

    const response = await this.smartsheet.addColumn(this.sheetId, {
      $,
      data: [
        column,
      ],
    });
    $.export("$summary", `Added column "${this.title}" (${this.columnType}) to sheet ${this.sheetId}`);
    return response;
  },
};
