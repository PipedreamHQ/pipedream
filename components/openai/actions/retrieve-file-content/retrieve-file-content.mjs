import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-file-content",
  name: "Retrieve File Content",
  description: "Retrieves the contents of the specified file. [See the documentation](https://platform.openai.com/docs/api-reference/files/retrieve-content)",
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
    const response = await this.openai.retrieveFileContent({
      file_id: this.file_id,
    });
    $.export("$summary", `Successfully retrieved file content with ID ${this.file_id}`);
    return response;
  },
};
