import smartsheet from "../../smartsheet.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "smartsheet-new-sheet-from-template",
  name: "New Sheet From Template",
  description: "Creates a new sheet from a template. [See docs here](https://smartsheet.redoc.ly/tag/sheets#operation/create-sheet-in-sheets-folder)",
  version: "0.0.3",
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
    },
    folderId: {
      propDefinition: [
        smartsheet,
        "folderId",
      ],
    },
  },
  async run({ $ }) {
    const {
      name,
      templateId,
      workspaceId,
      folderId,
    } = this;

    if (workspaceId && folderId) {
      throw new ConfigurationError("Only one of `workspaceId` or `folderId` may be entered");
    }

    let response;
    const data = {
      fromId: templateId,
      name,
    };

    if (workspaceId) {
      response = await this.smartsheet.createSheetInWorkspace(workspaceId, {
        data,
        $,
      });
    } else if (folderId) {
      response = await this.smartsheet.createSheetInFolder(folderId, {
        data,
        $,
      });
    } else {
      response = await this.smartsheet.createSheet({
        data,
        $,
      });
    }

    $.export("$summary", `Successfully created sheet with ID ${response.result.id}`);

    return response;
  },
};
