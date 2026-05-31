import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-store-file",
  name: "Store File",
  description: "Store a publicly accessible file URL in RenderIO storage. [See the documentation](https://renderio.dev/docs/api-reference/files/store-file)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The publicly accessible URL of the file to store, for example `https://example.com/video.mp4`.",
    },
  },
  async run({ $ }) {
    const response = await this.renderio.storeFile({
      $,
      data: {
        file_url: this.fileUrl,
      },
    });
    $.export("$summary", `Successfully stored file${response.file_id
      ? ` ${response.file_id}`
      : ""}`);
    return response;
  },
};
