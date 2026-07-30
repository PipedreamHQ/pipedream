import app from "../../box.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "box-list-file-versions",
  name: "List File Versions",
  description: "Lists all versions of a file. [See the documentation](https://developer.box.com/reference/get-files-id-versions/).",
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
      description: "The file to list versions for",
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "A comma-separated list of attributes to include in the response. [See available fields](https://developer.box.com/reference/get-files-id-versions/#param-fields).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of versions to return per page (max 1000)",
      optional: true,
      default: 100,
      max: 1000,
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit || constants.pageSize,
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
