import egnyte from "../../egnyte.app.mjs";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import mime from "mime";

export default {
  key: "egnyte-upload-file",
  name: "Upload File",
  description: "Uploads a file to a specified folder in Egnyte. [See the documentation](https://developers.egnyte.com/docs/File_System_Management_API_Documentation#Upload-a-File)",
  version: "0.0.1",
  type: "action",
  props: {
    egnyte,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The full path to the folder where the file should be uploaded. Example: `/Shared/Documents",
    },
  },
  async run({ $ }) {
    const form = new FormData();

    const filePath = this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;

    const filename = path.basename(filePath);
    const contentType = mime.getType(filePath) || "application/octet-stream";

    form.append("file", fs.createReadStream(filePath), {
      filename,
      contentType,
    });

    let folderPath = this.folderPath;
    if (folderPath.startsWith("/")) {
      folderPath = folderPath.slice(1);
    }
    if (folderPath.endsWith("/")) {
      folderPath = folderPath.slice(0, -1);
    }

    const response = await this.egnyte.uploadFile({
      $,
      folderPath,
      filename,
      data: form,
      headers: form.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded file ${filename}`);
    return response;
  },
};
