import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-file",
  name: "Retrieve File",
  description: "Retrieves a specific file from OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/retrieve)",
  version: "0.0.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.openai.retrieveFile({
      $,
      file_id: this.fileId,
    });

    $.export("$summary", `Successfully retrieved file with ID ${this.fileId}`);
    return response;
  },
};
