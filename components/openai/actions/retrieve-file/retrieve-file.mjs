import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-file",
  name: "Retrieve File",
  description: "Retrieves a specific file from OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/retrieve)",
  version: "0.0.5",
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
    const response = await this.openai.retrieveFile({
      file_id: this.file_id,
    });

    $.export("$summary", `Successfully retrieved file with ID ${this.file_id}`);
    return response;
  },
};
