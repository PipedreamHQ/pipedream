import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-list-folders",
  name: "List Folders",
  description: "List folders which contain Documents. [See the documentation here](https://developers.pandadoc.com/reference/list-documents-folders)",
  type: "action",
  version: "0.0.6",
  props: {
    app,
    parentFolderId: {
      propDefinition: [
        app,
        "documentFolderId",
      ],
      label: "Parent Folder ID",
      description: "The ID of a parent folder whose folders to list. If not set, the root folder will be used.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { parentFolderId } = this;

    const response = await this.app.listDocumentFolders({
      $,
      params: {
        parent_uuid: parentFolderId,
      },
    });

    $.export("$summary", `Successfully fetched ${response?.results?.length} folders`);
    return response;
  },
};
