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
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smartsheet,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new sheet",
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
        "workspaceId",
      ],
      description: "Workspace to create the sheet in. Required if Folder is not specified. Use **List Workspace Options** to find workspace IDs.",
    },
    folderId: {
      propDefinition: [
        smartsheet,
        "folderId",
      ],
      description: "Folder to create the sheet in. Required if Workspace is not specified as the sole destination. Use **List Folder Options** to find folder IDs.",
    },
  },
  async run({ $ }) {
    const {
      name,
      templateId,
      workspaceId,
      folderId,
    } = this;

    if (!workspaceId && !folderId) {
      throw new ConfigurationError("Either a Workspace or Folder must be specified. Creating sheets in the default Sheets folder is deprecated.");
    }

    if (workspaceId && folderId) {
      throw new ConfigurationError("Only one of Workspace or Folder may be specified");
    }

    const data = {
      fromId: templateId,
      name,
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
