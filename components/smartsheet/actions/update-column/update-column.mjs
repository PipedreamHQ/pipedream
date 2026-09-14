import { ConfigurationError } from "@pipedream/platform";
import {
  COLUMN_TYPES, PICKLIST_COLUMN_TYPES,
} from "../../common/constants.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-update-column",
  name: "Update Column",
  description:
    "Update a column's title, type, or position in a sheet."
    + " Use **List Columns** to find the column ID and current properties before updating."
    + " Note: some type conversions may cause data loss."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/columns/column-updatecolumn)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    sheetId: {
      propDefinition: [
        smartsheet,
        "sheetIdOrUrl",
      ],
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The ID of the column to update (e.g. `7894561230123456`). Use **List Columns** to find column IDs.",
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
      description: "JSON array of option strings for a PICKLIST or MULTI_PICKLIST column. Requires New Type to be set as well, since the API rejects an options change that omits the column type. Example: `[\"Option A\", \"Option B\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    let parsedOptions;
    if (this.options) {
      // The API's own error names five unrelated fields; name the missing one instead.
      if (!this.type) {
        throw new ConfigurationError("`New Type` is required when changing `Picklist Options`. Set it to PICKLIST or MULTI_PICKLIST.");
      }
      if (!PICKLIST_COLUMN_TYPES.includes(this.type)) {
        throw new ConfigurationError("`Picklist Options` can only be used when New Type is PICKLIST or MULTI_PICKLIST.");
      }
      try {
        parsedOptions = JSON.parse(this.options);
      } catch {
        throw new ConfigurationError("`Picklist Options` must be a valid JSON array (e.g. `[\"Option A\", \"Option B\"]`).");
      }
      if (
        !Array.isArray(parsedOptions)
        || !parsedOptions.length
        || parsedOptions.some((v) => typeof v !== "string" || !v.trim())
      ) {
        throw new ConfigurationError("`Picklist Options` must be a non-empty JSON array of non-empty strings.");
      }
    }

    const data = {
      ...(this.title
        ? {
          title: this.title,
        }
        : {}),
      ...(this.type
        ? {
          type: this.type,
        }
        : {}),
      ...(this.index !== undefined
        ? {
          index: this.index,
        }
        : {}),
      ...(parsedOptions
        ? {
          options: parsedOptions,
        }
        : {}),
    };

    if (!Object.keys(data).length) {
      throw new ConfigurationError("Provide at least one of: New Title, New Type, New Position, Picklist Options.");
    }

    const sheetId = await this.smartsheet.resolveSheetId(this.sheetId, {
      $,
    });
    const response = await this.smartsheet.updateColumn(sheetId, this.columnId, {
      $,
      data,
    });
    $.export("$summary", `Updated column ${this.columnId} in sheet ${sheetId}`);
    return response;
  },
};
