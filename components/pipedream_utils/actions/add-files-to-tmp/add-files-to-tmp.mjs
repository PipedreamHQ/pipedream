import pipedream_utils from "../../pipedream_utils.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export default {
  key: "pipedream_utils-add-files-to-tmp",
  name: "Add Files To /tmp",
  description: "Adds a list of files to [your workflow's /tmp directory](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedream_utils,
    files: {
      type: "string[]",
      label: "Files",
      description: "An array of File URLs or base64-encoded file contents",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
    generateTempFilename(extension = "") {
      const timestamp = Date.now();
      const randomBytes = crypto.randomBytes(8).toString("hex");
      return `tmp_${timestamp}_${randomBytes}${extension}`;
    },
    getExtensionFromUrl(url) {
      try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname);
        return ext || "";
      } catch {
        return "";
      }
    },
    getExtensionFromDataUri(dataUri) {
      const match = dataUri.match(/^data:([^;,]+)/);
      if (match) {
        const mimeType = match[1];
        const mimeToExt = {
          "image/jpeg": ".jpg",
          "image/png": ".png",
          "image/gif": ".gif",
          "image/webp": ".webp",
          "image/svg+xml": ".svg",
          "application/pdf": ".pdf",
          "text/plain": ".txt",
          "text/html": ".html",
          "text/css": ".css",
          "text/csv": ".csv",
          "application/json": ".json",
          "application/xml": ".xml",
          "audio/mpeg": ".mp3",
          "audio/wav": ".wav",
          "video/mp4": ".mp4",
          "video/webm": ".webm",
        };
        return mimeToExt[mimeType] || "";
      }
      return "";
    },
  },
  async run({ $ }) {
    const files = [];
    for (const file of this.files) {
      try {
        let extension = "";
        if (file.startsWith("data:")) {
          extension = this.getExtensionFromDataUri(file);
        } else if (file.startsWith("http")) {
          extension = this.getExtensionFromUrl(file);
        }

        const filename = this.generateTempFilename(extension);
        const filepath = `/tmp/${filename}`;

        if (file.startsWith("data:") || file.startsWith("http")) {
          const { stream } = await getFileStreamAndMetadata(file);
          const buffer = await this.streamToBuffer(stream);
          fs.writeFileSync(filepath, buffer);
        } else {
          fs.writeFileSync(filepath, Buffer.from(file, "base64"));
        }
        files.push({
          filename,
          filepath,
        });
      } catch {
        console.log(`Failed to add file: ${file}`);
      }
    }
    if (files.length === this.files.length) {
      $.export("$summary", `Successfully added ${files.length} file${files.length === 1
        ? ""
        : "s"} to /tmp`);
    } else if (files.length > 0) {
      $.export("$summary", `Successfully added ${files.length} of ${this.files.length} files to /tmp`);
    } else {
      throw new Error("Failed to add files to /tmp");
    }
    return files;
  },
};
