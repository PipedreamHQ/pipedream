import path from "path";
import slack from "../../slack_v2.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "slack_v2-download-file",
  name: "Download File",
  description: "Download the content of a Slack file (e.g. an image, PDF or snippet shared in a channel) to the file-stash directory, returning the saved path plus the file metadata (`name`, `mimetype`, `size`). Canvases download as HTML. Get the file ID from a message's `files[].id` via **Get Channel History**, or from **List Files** / **Browse Files**. Works for files in private channels the authenticated user is a member of. Example: passing `file` `F0123456789` downloads `diagram.png` to `/tmp/F0123456789-diagram.png` and returns `{ \"filedata\": [\"F0123456789-diagram.png\", \"/tmp/F0123456789-diagram.png\"], \"file\": { \"id\": \"F0123456789\", \"name\": \"diagram.png\", \"mimetype\": \"image/png\", \"size\": 84213 } }`. [See the documentation](https://docs.slack.dev/reference/objects/file-object#access)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    file: {
      propDefinition: [
        slack,
        "file",
      ],
      description: "The file's ID (e.g. `F1234567890`). Run **Get Channel History** (a message's `files[].id`), **List Files** or **Browse Files** first to obtain it.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      response: { file: metadata }, asBot,
    } = await this.slack.makeFilesReadRequest({
      method: "files.info",
      file: this.file,
    });

    const url = metadata.url_private_download || metadata.url_private;
    if (!url) {
      throw new Error(`File "${this.file}" has no downloadable content. Slack only hosts content for files uploaded to Slack and canvases, so external files (e.g. Google Drive links) and deleted files can't be downloaded.`);
    }
    if (metadata.size > constants.MAX_DOWNLOAD_SIZE_BYTES) {
      throw new Error(`File "${metadata.name}" is ${metadata.size} bytes, which exceeds the ${constants.MAX_DOWNLOAD_SIZE_BYTES}-byte (2GB) /tmp disk limit for this execution, so it cannot be downloaded.`);
    }

    let safeFilename = path.basename(metadata.name ?? "");
    if (!safeFilename || safeFilename === "." || safeFilename === "..") {
      throw new Error(`Invalid filename "${metadata.name}" returned by Slack.`);
    }
    if (metadata.filetype === constants.CANVAS_FILETYPE && !path.extname(safeFilename)) {
      safeFilename += ".html";
    }
    const savedFilename = `${metadata.id}-${safeFilename}`;
    const stashDir = process.env.STASH_DIR || "/tmp";
    const downloadedFilepath = path.join(stashDir, savedFilename);

    const bytesWritten = await this.slack.downloadFileContent({
      $,
      url,
      asBot,
      filepath: downloadedFilepath,
    });

    $.export("$summary", `Downloaded ${metadata.name} (${bytesWritten} bytes)`);

    return {
      filedata: [
        savedFilename,
        downloadedFilepath,
      ],
      file: {
        id: metadata.id,
        name: metadata.name,
        title: metadata.title,
        mimetype: metadata.mimetype,
        filetype: metadata.filetype,
        size: bytesWritten,
      },
    };
  },
};
