import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "box-move-folder",
  name: "Move Folder",
  description: "Moves a folder to a new parent folder. Optionally rename the folder while moving. Provide the source folder ID and destination parent folder ID (`0` for root). Cannot move a folder into itself or one of its descendants. When renaming, the new name must be 1-255 characters, use only Unicode Basic Multilingual Plane (BMP) characters, and cannot contain non-printable characters, `/` or `\\`, leading or trailing spaces, or be `.` or `..`. Use **Create Folder** to create a destination first if needed. [See folder name restrictions](https://support.box.com/hc/en-us/articles/360044196773-Troubleshooting-Uploads-to-Box). [See the documentation](https://developer.box.com/reference/put-folders-id/).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder to move (e.g. `123456789`). Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    destinationFolderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Destination Folder",
      description: "The destination parent folder. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
      optional: false,
    },
    name: {
      type: "string",
      label: "New Name",
      description: "Optionally rename the folder while moving. Must be 1-255 characters and use only Unicode Basic Multilingual Plane (BMP) characters. Cannot contain non-printable characters, `/` or `\\`, leading or trailing spaces, or be `.` or `..`. [See folder name restrictions](https://support.box.com/hc/en-us/articles/360044196773-Troubleshooting-Uploads-to-Box).",
      optional: true,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      fields: utils.getFieldsParam(this.fields),
    };

    const data = {
      parent: {
        id: this.destinationFolderId,
      },
    };
    if (this.name !== undefined) {
      data.name = this.name;
    }

    const response = await this.app.updateFolder({
      $,
      folderId: this.folderId,
      params,
      data,
    });

    $.export("$summary", `Successfully moved folder "${response.name}"`);
    return response;
  },
};
