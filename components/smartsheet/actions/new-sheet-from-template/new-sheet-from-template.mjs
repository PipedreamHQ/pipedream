import smartsheet from "../../smartsheet.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { toPositiveInteger } from "../../common/utils.mjs";

export default {
  key: "smartsheet-new-sheet-from-template",
  name: "New Sheet From Template",
  description:
    "Creates a new sheet from a template. Requires either a workspace or folder destination."
    + " Use **List Workspace Templates** to find template IDs."
    + " Use **List Workspace Options** to find workspace IDs."
    + " Use **List Folder Options** to find folder IDs."
    + " Example: `{sheetName: \"Q1 Launch\", templateId: \"1122334455667788\", workspaceId: \"1234567890123456\"}`"
    + " returns the new sheet's ID and permalink."
    + " See the documentation: [Create in folder](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-folder), [Create in workspace](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/create-sheet-in-workspace)",
  version: "1.0.3",
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
      label: "Name",
      description: "Name of the new sheet",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to create the sheet from. Use **List Workspace Templates** or"
        + " **List Template ID Options** to find template IDs.",
    },
    workspaceId: {
      propDefinition: [
        smartsheet,
        "workspaceId",
      ],
      description: "Workspace to create the sheet in. Required if Folder is not specified. Use **List Workspace Options** to find workspace IDs.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Folder to create the sheet in. If specified, the sheet is created in this folder and Workspace"
        + " is not used. Use **List Folder Options** (with a workspace ID) to find folder IDs.",
      optional: true,
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

    const numericTemplateId = toPositiveInteger(templateId);
    if (!Number.isInteger(numericTemplateId) || numericTemplateId <= 0) {
      throw new ConfigurationError("`Template ID` must be a positive integer template ID.");
    }

    const data = {
      fromId: numericTemplateId,
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
