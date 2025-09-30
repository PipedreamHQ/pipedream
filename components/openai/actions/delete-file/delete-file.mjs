import openai from "../../openai.app.mjs";

export default {
  key: "openai-delete-file",
  name: "Delete File",
  description: "Deletes a specified file from OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/delete)",
  version: "0.0.17",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    fileId: {
      propDefinition: [
        openai,
        "fileId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.deleteFile({
      $,
      file_id: this.fileId,
    });

    $.export("$summary", `Successfully deleted file with ID: ${this.fileId}`);
    return response;
  },
};
