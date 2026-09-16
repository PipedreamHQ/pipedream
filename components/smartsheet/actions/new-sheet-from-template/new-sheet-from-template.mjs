import smartsheet from "../../smartsheet.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "smartsheet-new-sheet-from-template",
  name: "New Sheet From Template",
  description:
    "Creates a new sheet from a template. Requires either a workspace or folder destination."
    + " Use **List Workspace Templates** to find template IDs."
    + " Use **List Workspace Options** to find workspace IDs."
    + " Use **List Folder Options** to find folder IDs."
    + " See the documentation: [Create in folder](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-folder), [Create in workspace](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-workspace)",
  version: "2.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    smartsheet,
    sheetName: {
      type: "string",
      label: "Sheet Name",
      description: "Name for the new sheet created from the template.",
    },
    templateId: {
      propDefinition: [
        smartsheet,
        "templateId",
      ],
    },
    workspaceId: {
      propDefinition: [
        smartsheet,
        "workspaceIdInput",
      ],
      description: "Workspace to create the sheet in. Required if Folder ID is not set. Numeric workspace ID (e.g. `1234567890123456`). Use **List Workspace Options** to find one.",
    },
    folderId: {
      propDefinition: [
        smartsheet,
        "folderIdInput",
      ],
      description: "Folder to create the sheet in. If set, the sheet goes here and Workspace ID is ignored. Numeric folder ID (e.g. `9876543210987654`). Use **List Folder Options** with a workspace ID to find one.",
    },
  },
  async run({ $ }) {
    const {
      sheetName,
      templateId,
      workspaceId,
      folderId,
    } = this;

    if (!workspaceId && !folderId) {
      throw new ConfigurationError("Either a Workspace or Folder must be specified. Creating sheets in the default Sheets folder is deprecated.");
    }

    const data = {
      fromId: templateId,
      name: sheetName,
    };

    let response;
    if (folderId) {
      response = await this.smartsheet.createSheetInFolder(folderId, {
        data,
        $,
      });
    } else {
      response = await this.smartsheet.createSheetInWorkspace(workspaceId, {
        data,
        $,
      });
    }

    $.export("$summary", `Successfully created sheet with ID ${response.result.id}`);

    return response;
  },
};
