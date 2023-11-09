import openai from "../../openai.app.mjs";

export default {
  key: "openai-upload-file",
  name: "Upload File",
  description: "Upload a file that can be used across various endpoints/features. The size of individual files can be a maximum of 512mb. [See the documentation](https://beta.openai.com/docs/guides/files)",
  version: "0.0.4",
  type: "action",
  props: {
    openai,
    file: {
      type: "string",
      label: "File",
      description: "The file content to be uploaded, represented as a string. The size of individual files can be a maximum of 512mb.",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The intended purpose of the file.",
      options: [
        {
          label: "fine-tune",
          value: "fine-tune",
        },
        {
          label: "assistants",
          value: "assistants",
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.uploadFile({
      file: this.file,
      purpose: this.purpose,
    });

    $.export("$summary", `Successfully uploaded file with purpose: ${this.purpose}`);
    return response;
  },
};
