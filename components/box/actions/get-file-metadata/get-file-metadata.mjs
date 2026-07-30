// x-pd-ai: optimized
import app from "../../box.app.mjs";

export default {
  key: "box-get-file-metadata",
  name: "Get File Metadata",
  description: "Retrieves metadata for a file (name, size, timestamps, path, and more). Optionally request specific fields. Use **List File Versions** for version history, or **Download File** for content. [See the documentation](https://developer.box.com/reference/get-files-id/).",
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
      description: "The parent folder of the file. Use `0` for the root folder.",
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
      description: "The file to retrieve metadata for (e.g. `123456789`)",
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

    const label = response.name || response.id || this.fileId;
    $.export("$summary", `Successfully retrieved metadata for file "${label}"`);
    return response;
  },
};
