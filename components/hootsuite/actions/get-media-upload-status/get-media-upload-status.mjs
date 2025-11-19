import hootsuite from "../../hootsuite.app.mjs";

export default {
  key: "hootsuite-get-media-upload-status",
  name: "Get Media Upload Status",
  description: "Gets the status of a Media Upload Job on your Hootsuite account. [See the documentation](https://apidocs.hootsuite.com/docs/api/index.html#operation/getMedia)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hootsuite,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to get the status of.",
    },
  },
  async run({ $ }) {
    const response = await this.hootsuite.getMediaUploadStatus({
      $,
      fileId: this.fileId,
    });

    $.export("$summary", `Successfully got media upload status for file ID: ${this.fileId}`);
    return response;
  },
};
