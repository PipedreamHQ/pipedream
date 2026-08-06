// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";

export default {
  key: "box-list-collaborations",
  name: "List Collaborations",
  description: "Lists the collaborations (users and groups with access, and their roles) on a Box file or folder. Use this to find a collaboration ID before calling **Delete Collaboration**, or to audit who has access to an item. Item Type must be `file` or `folder`. [See the documentation](https://developer.box.com/reference/get-files-id-collaborations/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    itemType: {
      propDefinition: [
        app,
        "itemType",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to list collaborations for when Item Type is `folder`. When Item Type is `file`, this instead scopes the File dropdown to a parent folder. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      label: "File",
      description: "The file to list collaborations for (e.g. `123456789`). Required when Item Type is `file`. Use the **List Folder Items** action to retrieve file IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;

    if (this.itemType === "file") {
      if (!this.fileId) {
        throw new ConfigurationError("File is required when Item Type is `file`.");
      }
      response = await this.app.listFileCollaborations({
        $,
        fileId: this.fileId,
      });
    } else {
      if (!this.folderId) {
        throw new ConfigurationError("Parent Folder is required when Item Type is `folder`.");
      }
      response = await this.app.listFolderCollaborations({
        $,
        folderId: this.folderId,
      });
    }

    const collabCount = response.entries?.length || 0;
    $.export("$summary", `Retrieved ${collabCount} collaboration${collabCount === 1
      ? ""
      : "s"}`);

    return response;
  },
};
