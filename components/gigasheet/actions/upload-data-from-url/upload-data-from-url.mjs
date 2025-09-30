import gigasheet from "../../gigasheet.app.mjs";

export default {
  key: "gigasheet-upload-data-from-url",
  name: "Upload Data From URL",
  description: "Uploads data from a URL to Gigasheet. [See the documentation](https://gigasheet.readme.io/reference/post_upload-url)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gigasheet,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to upload to Gigasheet",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the uploaded file",
      optional: true,
    },
    folderHandle: {
      propDefinition: [
        gigasheet,
        "folderHandle",
      ],
      description: "Folder handle of the uploaded file",
    },
    targetHandle: {
      propDefinition: [
        gigasheet,
        "handle",
      ],
      label: "Target Handle",
      description: "If specified, records will be appended to this handle",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      url, name, folderHandle, targetHandle,
    } = this;
    const response = await this.gigasheet.uploadDataFromUrl({
      $,
      data: {
        url,
        name,
        folderHandle,
        targetHandle,
      },
    });
    $.export("$summary", "Data uploaded from URL successfully");
    return response;
  },
};
