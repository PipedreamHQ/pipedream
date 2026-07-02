import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-get-stored-file",
  name: "Get Stored File",
  description: "Retrieve a stored file by ID. [See the documentation](https://renderio.dev/docs/api-reference/files/get-file)",
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
      description: "The unique identifier of the file to retrieve, for example `f1a2b3c4-d5e6-7890-abcd-ef1234567890`. Use **List Stored Files** to discover options.",
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
