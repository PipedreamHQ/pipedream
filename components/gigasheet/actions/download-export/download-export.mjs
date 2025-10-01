import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-download-export",
  name: "Download Export",
  description: "Downloads an export from Gigasheet. [See the documentation](https://gigasheet.readme.io/reference/get_dataset-handle-download-export)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gigasheet,
    handle: {
      propDefinition: [
        gigasheet,
        "handle",
      ],
      description: "The handle of the dataset to download",
    },
  },
  async run({ $ }) {
    const response = await this.gigasheet.downloadExport({
      $,
      handle: this.handle,
    });
    $.export("$summary", "Successfully downloaded export");
    return response;
  },
};
