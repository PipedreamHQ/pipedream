import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-create-folder",
  name: "Create Folder",
  description: "Create a new folder to store your documents. [See the documentation here](https://developers.pandadoc.com/reference/create-documents-folder)",
  type: "action",
  version: "0.0.6",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name the folder for Documents you are creating.",
    },
    parentFolderId: {
      propDefinition: [
        app,
        "documentFolderId",
      ],
      label: "Parent Folder ID",
      description: "The ID of a parent folder. If not set, the new folder will be created in the root folder.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      parentFolderId,
    } = this;

    const response = await this.app.createFolder({
      $,
      data: {
        name,
        parent_uuid: parentFolderId,
      },
    });

    $.export("$summary", `Successfully created folder "${response.name ?? response.uuid}"`);
    return response;
  },
};
