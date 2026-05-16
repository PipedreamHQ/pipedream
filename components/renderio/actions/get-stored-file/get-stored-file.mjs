import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-get-stored-file",
  name: "Get Stored File",
  description: "Retrieve a stored file by ID. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    renderio,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The unique identifier of the file to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.renderio.getFile({
      $,
      fileId: this.fileId,
    });
    $.export("$summary", `Successfully retrieved file ${this.fileId}`);
    return response;
  },
};
