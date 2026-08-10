// x-pd-ai: optimized
import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "box-list-file-versions",
  name: "List File Versions",
  description: "Lists prior versions of a file (does not include the current version). Box only tracks file versions for users with premium accounts, so this returns an empty list on free accounts. Use **Get File Metadata** for current file details, or **Upload File Version** to create a new version. [See the documentation](https://developer.box.com/reference/get-files-id-versions/).",
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
      description: "The parent folder of the file. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
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
      description: "The file to list versions for (e.g. `123456789`). Use the **List Folder Items** action to retrieve file IDs.",
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
      description: "The maximum number of results to return per page. Use an integer from 1 through 1000.",
    },
  },
  async run({ $ }) {
    const params = {
      limit: this.limit,
      fields: utils.getFieldsParam(this.fields),
    };

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
