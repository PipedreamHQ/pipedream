import openai from "../../openai.app.mjs";
import fs from "fs";

export default {
  key: "openai-retrieve-file-content",
  name: "Retrieve File Content",
  description: "Retrieves the contents of the specified file. [See the documentation](https://platform.openai.com/docs/api-reference/files/retrieve-content)",
  version: "0.0.10",
  type: "action",
  props: {
    openai,
    fileId: {
      propDefinition: [
        openai,
        "fileId",
      ],
    },
    fileName: {
      type: "string",
      label: "Filename",
      description: "Optionally, download the file to the `/tmp` directory using the given filename",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.retrieveFileContent({
      $,
      file_id: this.fileId,
      responseType: "arraybuffer",
    });

    if (!this.fileName) {
      $.export("$summary", `Successfully retrieved file content with ID ${this.fileId}`);
      return response;
    }

    const outputFilePath = this.fileName.includes("tmp/")
      ? this.fileName
      : `/tmp/${this.fileName}`;
    await fs.promises.writeFile(outputFilePath, Buffer.from(response));
    const filedata = [
      this.fileName,
      outputFilePath,
    ];
    $.export("$summary", `Successfully retrieved and downloaded file content with ID ${this.fileId}`);
    return filedata;
  },
};
