import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-delete-stored-file",
  name: "Delete Stored File",
  description: "Delete a stored file by ID. [See the documentation](https://renderio.dev/docs/api-reference/files/delete-file)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    fileId: {
      type: "string",
      label: "File ID",
      description: "The unique identifier of the file to delete, for example `f1a2b3c4-d5e6-7890-abcd-ef1234567890`. Use **List Stored Files** to discover options.",
    },
  },
  async run({ $ }) {
    const response = await this.renderio.deleteFile({
      $,
      fileId: this.fileId,
    });
    $.export("$summary", `Successfully deleted file ${this.fileId}`);
    return response;
  },
};
