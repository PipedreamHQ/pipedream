import app from "../../box.app.mjs";

export default {
  key: "box-get-file-metadata",
  name: "Get File Metadata",
  description: "Retrieves metadata for a file. [See the documentation](https://developer.box.com/reference/get-files-id/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "Use this option to select your File ID from a dropdown list.",
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
      description: "The file to retrieve metadata for",
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "A comma-separated list of attributes to include in the response (e.g. `id,type,name,size,created_at,modified_at`). [See available fields](https://developer.box.com/reference/get-files-id/#param-fields).",
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.fields?.length) {
      params.fields = Array.isArray(this.fields)
        ? this.fields.join(",")
        : this.fields;
    }

    const response = await this.app.getFile({
      $,
      fileId: this.fileId,
      params,
    });

    $.export("$summary", `Successfully retrieved metadata for file "${response.name}"`);
    return response;
  },
};
