// x-pd-ai: optimized
import app from "../../box.app.mjs";

export default {
  key: "box-list-file-versions",
  name: "List File Versions",
  description: "Lists prior versions of a file (does not include the current version). Use **Get File Metadata** for current file details, or **Upload File Version** to create a new version. [See the documentation](https://developer.box.com/reference/get-files-id-versions/).",
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
      description: "The file to list versions for (e.g. `123456789`)",
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "A comma-separated list of attributes to include in the response. [See available fields](https://developer.box.com/reference/get-files-id-versions/#param-fields).",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "The maximum number of versions to return per page (max 1000)",
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
    };
    if (this.fields?.length) {
      params.fields = Array.isArray(this.fields)
        ? this.fields.join(",")
        : this.fields;
    }

    const response = await this.app.listFileVersions({
      $,
      fileId: this.fileId,
      params,
    });

    const versionCount = response.entries?.length || 0;
    $.export("$summary", `Retrieved ${versionCount} version${versionCount === 1
      ? ""
      : "s"} for file`);

    return response;
  },
};
