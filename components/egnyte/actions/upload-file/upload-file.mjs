import egnyte from "../../egnyte.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "egnyte-upload-file",
  name: "Upload File",
  description: "Uploads a file to a specified folder in Egnyte. [See the documentation](https://developers.egnyte.com/docs/File_System_Management_API_Documentation#Upload-a-File)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    egnyte,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The full path to the folder where the file should be uploaded. Example: `/Shared/Documents",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const filename = metadata.name;

    form.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename,
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
