import app from "../../box.app.mjs";

export default {
  key: "box-move-folder",
  name: "Move Folder",
  description: "Moves a folder to a new parent folder. Optionally rename the folder while moving. [See the documentation](https://developer.box.com/reference/put-folders-id/).",
  version: "0.0.1",
  type: "action",
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
      description: "The folder to move",
      optional: false,
    },
    destinationFolderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Destination Folder",
      description: "The destination parent folder. Use `0` for the root folder.",
      optional: false,
    },
    name: {
      type: "string",
      label: "New Name",
      description: "Optionally rename the folder while moving",
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
    const params = {};
    if (this.fields?.length) {
      params.fields = Array.isArray(this.fields)
        ? this.fields.join(",")
        : this.fields;
    }

    const data = {
      parent: {
        id: this.destinationFolderId,
      },
    };
    if (this.name) {
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
