import openai from "../../openai.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "openai-upload-file",
  name: "Upload File",
  description: "Uploads a file to be used with features like Assistants and Fine-tuning. [See the documentation](https://platform.openai.com/docs/api-reference/files/create)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    file: {
      propDefinition: [
        openai,
        "file",
      ],
    },
    purpose: {
      propDefinition: [
        openai,
        "purpose",
      ],
    },
  },
  async run({ $ }) {
    const {
      file, purpose,
    } = this;
    const data = new FormData();
    const content = fs.createReadStream(file.includes("tmp/")
      ? file
      : `/tmp/${file}`);
    data.append("purpose", purpose);
    data.append("file", content);

    const response = await this.openai.uploadFile({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file with purpose: ${purpose}`);
    return response;
  },
};
