import app from "../../box.app.mjs";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

export default {
  name: "Download File",
  description: "Downloads a file from Box to your workflow's `/tmp` directory. [See the documentation](https://developer.box.com/reference/get-files-id-content/)",
  key: "box-download-file",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "Folder containing the file to download",
      optional: false,
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    fileName: {
      propDefinition: [
        app,
        "fileName",
      ],
      description: "The name of the new downloaded file",
      optional: false,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const fileStream = await this.app.downloadFile({
      $,
      fileId: this.fileId,
    });

    const filePath = `/tmp/${this.fileName}`;

    const pipeline = promisify(stream.pipeline);
    await pipeline(fileStream, fs.createWriteStream(filePath));

    return {
      filePath,
    };
  },
};
