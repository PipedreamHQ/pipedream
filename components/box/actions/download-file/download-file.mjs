import app from "../../box.app.mjs";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

export default {
  name: "Download File",
  description: "Downloads a file from Box to your workflow's `/tmp` directory and returns the saved file path. Use **Get File Metadata** to check the file's name and size first, or **Get File Text** to extract text content without downloading. [See the documentation](https://developer.box.com/reference/get-files-id-content/)",
  key: "box-download-file",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Folder",
      description: "The folder containing the file to download. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
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
      description: "The name to save the downloaded file as in `/tmp` (e.g. `report.pdf`)",
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

    $.export("$summary", `Successfully downloaded file to \`${filePath}\``);

    return {
      filePath,
    };
  },
};
