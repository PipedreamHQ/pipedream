import openai from "../../openai.app.mjs";

export default {
  key: "openai-delete-file",
  name: "Delete File",
  description: "Deletes a specified file from OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/delete)",
  version: "0.0.4",
  type: "action",
  props: {
    openai,
    file_id: {
      propDefinition: [
        openai,
        "file_id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.deleteFile({
      file_id: this.file_id,
    });

    $.export("$summary", `Successfully deleted file with ID: ${this.file_id}`);
    return response;
  },
};
