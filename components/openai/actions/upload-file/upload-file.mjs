import openai from "../../openai.app.mjs";
import fs from "fs";

export default {
  key: "openai-upload-file",
  name: "Upload File",
  description: "Uploads a file to be used with features like Assistants and Fine-tuning. [See the documentation](https://platform.openai.com/docs/api-reference/files/upload)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    file: {
      type: "string",
      label: "File",
      description: "The reference to a file on `/tmp` to be uploaded.",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The intended purpose of the uploaded file. Use 'fine-tune' for fine-tuning and 'assistants' for assistants and messages.",
      options: [
        "fine-tune",
        "assistants",
      ],
    },
  },
  async run({ $ }) {
    const form = new FormData();
    form.append("purpose", this.purpose);
    form.append("file", fs.createReadStream(`/tmp/${this.file}`));

    const response = await this.openai.createFile({
      purpose: this.purpose,
      file: `/tmp/${this.file}`,
    });

    $.export("$summary", `Successfully uploaded file with purpose: ${this.purpose}`);
    return response;
  },
};
