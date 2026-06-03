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
  version: "1.0.0",
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
      description: "Workspace to create the sheet in, or to scope the Folder dropdown. Required if Folder is not specified. Use **List Workspace Options** to find workspace IDs.",
    },
    folderId: {
      propDefinition: [
        smartsheet,
        "folderId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      description: "Folder to create the sheet in. If specified, the sheet is created in this folder and Workspace is only used to populate this dropdown. Use **List Folder Options** to find folder IDs.",
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
