import { COLUMN_TYPES } from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-column",
  name: "Update Column",
  description:
    "Update a column's title, type, or position in a sheet."
    + " Use **List Columns** to find the column ID and current properties before updating."
    + " Note: some type conversions may cause data loss."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/column-updatecolumn)",
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
      description: "The ID of the sheet containing the column. Use **List Sheets** to find sheet IDs.",
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The ID of the column to update. Use **List Columns** to find column IDs.",
    },
    title: {
      type: "string",
      label: "New Title",
      description: "New title for the column.",
      optional: true,
    },
    type: {
      type: "string",
      label: "New Type",
      description: "New column type. Note: some type conversions may cause data loss.",
      options: COLUMN_TYPES,
      optional: true,
    },
    index: {
      type: "integer",
      label: "New Position",
      description: "New zero-based position for the column.",
      optional: true,
    },
    options: {
      type: "string",
      label: "Picklist Options",
      description: "JSON array of option strings for PICKLIST columns. Example: `[\"Option A\", \"Option B\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      ...(this.title ? { title: this.title } : {}),
      ...(this.type ? { type: this.type } : {}),
      ...(this.index !== undefined ? { index: this.index } : {}),
      ...(this.options ? { options: JSON.parse(this.options) } : {}),
    };

    const response = await this.smartsheet.updateColumn(this.sheetId, this.columnId, {
      $,
      data,
    });
    $.export("$summary", `Updated column ${this.columnId} in sheet ${this.sheetId}`);
    return response;
  },
};
