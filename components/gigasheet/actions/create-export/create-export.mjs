import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-create-export",
  name: "Create Export",
  description: "Creates an export for a gigasheet dataset. [See the documentation](https://gigasheet.readme.io/reference/post_dataset-handle-export)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gigasheet,
    handle: {
      propDefinition: [
        gigasheet,
        "handle",
      ],
      description: "The handle of the dataset you want to export",
    },
    filename: {
      type: "string",
      label: "File name",
      optional: true,
    },
    folderHandle: {
      propDefinition: [
        gigasheet,
        "folderHandle",
      ],
      description: "Folder handle of the uploaded file",
    },
    gridState: {
      type: "object",
      label: "Grid State",
      description: "Grid state object. Values will be attempted to be parsed as JSON strings. [See the documentation](https://gigasheet.readme.io/reference/post_dataset-handle-export) for valid properties.",
    },
    recordsPerFile: {
      type: "integer",
      label: "Records per File",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      handle,
      filename,
      folderHandle,
      gridState,
      recordsPerFile,
    } = this;

    Object.entries(gridState).forEach(([
      key,
      value,
    ]) => {
      try {
        gridState[key] = JSON.parse(value);
      } catch (err) {
        // values may be JSON strings, but not necessarily
      }
    });

    const response = await this.gigasheet.createExport({
      $,
      handle,
      data: {
        filename,
        folderHandle,
        gridState,
        recordsPerFile,
      },
    });
    $.export("$summary", "Successfully created export");
    return response;
  },
};
