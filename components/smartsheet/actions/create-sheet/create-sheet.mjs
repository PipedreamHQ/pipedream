import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-create-sheet",
  name: "Create Sheet",
  description:
    "Create a new blank sheet with column definitions in a workspace or folder."
    + " Columns array defines the schema — each column needs a `title` and `type`."
    + " Supported column types: TEXT_NUMBER, DATE, DATETIME, CONTACT_LIST, CHECKBOX, PICKLIST, DURATION, PREDECESSOR, ABSTRACT_DATETIME."
    + " For PICKLIST columns, include an `options` array with the valid values."
    + " You must provide either a Workspace ID or Folder ID — the home-level create endpoint is deprecated."
    + " Use **List Sheets** to verify the sheet was created."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-workspace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartsheet,
    name: {
      type: "string",
      label: "Sheet Name",
      description: "Name for the new sheet.",
    },
    columns: {
      type: "string",
      label: "Columns",
      description:
        "JSON array of column objects. Each needs `title` and `type`. The first column with `primary: true` becomes the primary column."
        + " Example: `[{\"title\": \"Task\", \"type\": \"TEXT_NUMBER\", \"primary\": true}, {\"title\": \"Due Date\", \"type\": \"DATE\"}, {\"title\": \"Status\", \"type\": \"PICKLIST\", \"options\": [\"Open\", \"In Progress\", \"Done\"]}]`",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Place the sheet in this workspace. Provide either Workspace ID or Folder ID (at least one is required).",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Place the sheet in this folder. Provide either Workspace ID or Folder ID (at least one is required).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.workspaceId && !this.folderId) {
      throw new ConfigurationError("Provide either Workspace ID or Folder ID. The home-level create endpoint is deprecated.");
    }
    if (this.workspaceId && this.folderId) {
      throw new ConfigurationError("Provide either Workspace ID or Folder ID, not both.");
    }

    let parsedColumns;
    try {
      parsedColumns = JSON.parse(this.columns);
    } catch {
      throw new ConfigurationError("`Columns` must be a valid JSON array.");
    }
    if (!Array.isArray(parsedColumns) || !parsedColumns.length) {
      throw new ConfigurationError("`Columns` must be a non-empty JSON array of column objects.");
    }

    const columns = parsedColumns.map((col, i) => {
      if (col.validation !== undefined) {
        throw new ConfigurationError(`Column at index ${i} includes a \`validation\` field. Validation rules are not supported during sheet creation — use **Update Column** after creating the sheet to add validation.`);
      }
      if (typeof col.options === "string") {
        return {
          ...col,
          options: JSON.parse(col.options),
        };
      }
      return {
        ...col,
      };
    });
    if (!columns.some((c) => c.primary)) {
      columns[0].primary = true;
    }
    const data = {
      name: this.name,
      columns,
    };

    const response = this.workspaceId
      ? await this.smartsheet.createSheetInWorkspace(this.workspaceId, {
        $,
        data,
      })
      : await this.smartsheet.createSheetInFolder(this.folderId, {
        $,
        data,
      });

    $.export("$summary", `Created sheet "${response.result.name}" (ID: ${response.result.id})`);
    return response;
  },
};
