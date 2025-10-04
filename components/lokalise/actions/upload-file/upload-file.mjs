import lokalise from "../../lokalise.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "lokalise-upload-file",
  name: "Upload File",
  description: "Uploads a specified file to a Lokalise project. [See the documentation](https://developers.lokalise.com/reference/upload-a-file)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Path or URL",
      description: "The file to upload (see the [Lokalise documentation for supported file formats](https://docs.lokalise.com/en/collections/2909229-supported-file-formats)). Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`). Must be a [supported file format](https://docs.lokalise.com/en/collections/2909229-supported-file-formats).",
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
      description: "Set the filename. You may optionally use a relative path in the filename (e.g `admin/main.json`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const stream = await getFileStream(this.filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fileData = Buffer.concat(chunks).toString("base64");

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
