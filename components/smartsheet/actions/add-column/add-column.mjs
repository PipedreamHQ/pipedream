import { COLUMN_TYPES } from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-add-column",
  name: "Add Column",
  description:
    "Add a new column to a sheet. Specify the column title, type, and optionally the position and picklist options."
    + " For PICKLIST columns, provide the `options` array with valid values."
    + " Use **List Columns** to see existing columns before adding."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/columns-addtosheet)",
  version: "0.0.1",
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
      description: "The ID of the sheet to add a column to. Use **List Sheets** to find sheet IDs.",
    },
    title: {
      type: "string",
      label: "Column Title",
      description: "The column title. Must be unique within the sheet.",
    },
    type: {
      type: "string",
      label: "Column Type",
      description: "The data type for this column.",
      options: COLUMN_TYPES,
    },
    index: {
      type: "integer",
      label: "Position Index",
      description: "Zero-based position for the new column. If omitted, the column is added at the end.",
      optional: true,
    },
    options: {
      type: "string",
      label: "Picklist Options",
      description:
        "JSON array of option strings for PICKLIST columns."
        + " Example: `[\"Low\", \"Medium\", \"High\", \"Critical\"]`",
      optional: true,
    },
    validation: {
      type: "boolean",
      label: "Validation",
      description: "Set to `true` to restrict cell values to the picklist options. For PICKLIST columns only.",
      optional: true,
    },
  },
  async run({ $ }) {
    let index = this.index;
    if (index === undefined) {
      const { data: cols } = await this.smartsheet.listColumns(this.sheetId, {
        params: {
          includeAll: true,
        },
      });
      index = cols?.length || 0;
    }

    const column = {
      title: this.title,
      type: this.type,
      index,
    };
    if (this.options) {
      column.options = JSON.parse(this.options);
    }
    if (this.validation !== undefined) {
      column.validation = this.validation;
    }

    const response = await this.smartsheet.addColumn(this.sheetId, {
      $,
      data: [
        column,
      ],
    });
    $.export("$summary", `Added column "${this.title}" (${this.type}) to sheet ${this.sheetId}`);
    return response;
  },
};
