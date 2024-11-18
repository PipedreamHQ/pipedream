import lokalise from "../../lokalise.app.mjs";
import fs from "fs";

export default {
  key: "lokalise-upload-file",
  name: "Upload File",
  description: "Uploads a specified file to a Lokalise project. [See the documentation](https://developers.lokalise.com/reference/upload-a-file)",
  version: "0.0.1",
  type: "action",
  props: {
    lokalise,
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file of a [supported file format](https://docs.lokalise.com/en/collections/2909229-supported-file-formats) in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
    language: {
      propDefinition: [
        lokalise,
        "language",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Set the filename. You may optionally use a relative path in the filename",
    },
  },
  async run({ $ }) {
    const fileData = fs.readFileSync(this.filePath.startsWith("/tmp")
      ? this.filePath
      : `/tmp/${this.filePath}`, {
      encoding: "base64",
    });
    const response = await this.lokalise.uploadFile({
      $,
      projectId: this.projectId,
      data: {
        data: fileData,
        filename: this.filename,
        lang_iso: this.language,
      },
    });
    $.export("$summary", "Successfully uploaded file");
    return response;
  },
};
