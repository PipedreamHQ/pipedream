import { ConfigurationError } from "@pipedream/platform";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-create-sheet",
  name: "Create Sheet",
  description:
    "Create a new blank sheet with column definitions."
    + " Columns array defines the schema — each column needs a `title` and `type`."
    + " Supported column types: TEXT_NUMBER, DATE, DATETIME, CONTACT_LIST, CHECKBOX, PICKLIST, DURATION, PREDECESSOR, ABSTRACT_DATETIME."
    + " For PICKLIST columns, include an `options` array with the valid values."
    + " Optionally place the sheet in a workspace or folder by providing `workspaceId` or `folderId`."
    + " Use **List Sheets** to verify the sheet was created."
    + " See the documentation: [Create in folder](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-folder), [Create in workspace](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-workspace), [Create in Sheets folder](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-sheets-folder)",
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
      description: "Place the sheet in this workspace. Mutually exclusive with Folder ID.",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Place the sheet in this folder. Mutually exclusive with Workspace ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.workspaceId && this.folderId) {
      throw new ConfigurationError("Provide either Workspace ID or Folder ID, not both.");
    }

    const columns = JSON.parse(this.columns).map((col) => {
      const {
        validation, ...rest // eslint-disable-line no-unused-vars
      } = col;
      if (typeof rest.options === "string") {
        rest.options = JSON.parse(rest.options);
      }
      return rest;
    });
    const data = {
      name: this.name,
      columns,
    };

    let response;
    if (this.workspaceId) {
      response = await this.smartsheet.createSheetInWorkspace(this.workspaceId, {
        $,
        data,
      });
    } else if (this.folderId) {
      response = await this.smartsheet.createSheetInFolder(this.folderId, {
        $,
        data,
      });
    } else {
      response = await this.smartsheet.createSheet({
        $,
        data,
      });
    }

    $.export("$summary", `Created sheet "${response.result.name}" (ID: ${response.result.id})`);
    return response;
  },
};
