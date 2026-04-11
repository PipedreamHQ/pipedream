import { readFile } from "fs/promises";
import { basename, extname } from "path";
import { lookup } from "mime-types";
import fetch from "node-fetch";
import filepost from "../../filepost.app.mjs";

export default {
  key: "filepost-upload-file",
  name: "Upload File",
  description: "Upload a file from a path in `/tmp` or a public URL, and get back a permanent CDN URL. [See the documentation](https://filepost.dev/docs)",
  version: "0.1.0",
  type: "action",
  props: {
    filepost,
    filePathOrUrl: {
      propDefinition: [
        filepost,
        "filePath",
      ],
    },
  },
  async run({ $ }) {
    const input = this.filePathOrUrl.trim();
    let fileBuffer;
    let fileName;
    let mimeType;

    if (input.startsWith("http://") || input.startsWith("https://")) {
      // Download from URL with timeout and size guard (50 MB max)
      const MAX_BYTES = 50 * 1024 * 1024;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30_000);
      let res;
      try {
        res = await fetch(input, { signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);
      const contentLength = res.headers.get("content-length");
      if (contentLength && Number(contentLength) > MAX_BYTES) {
        throw new Error(`Remote file exceeds the 50 MB limit (${contentLength} bytes).`);
      }
      const chunks = [];
      let totalBytes = 0;
      for await (const chunk of res.body) {
        totalBytes += chunk.length;
        if (totalBytes > MAX_BYTES) throw new Error("Remote file exceeds the 50 MB limit.");
        chunks.push(chunk);
      }
      fileBuffer = Buffer.concat(chunks);
      const urlPath = new URL(input).pathname;
      fileName = basename(urlPath) || "file";
      mimeType = res.headers.get("content-type")?.split(";")[0] || lookup(fileName) || "application/octet-stream";
    } else {
      // Read from /tmp
      fileBuffer = await readFile(input);
      fileName = basename(input);
      mimeType = lookup(fileName) || "application/octet-stream";
    }

    // Ensure filename has extension
    if (!extname(fileName)) {
      const ext = mimeType.split("/")[1] || "bin";
      fileName = `${fileName}.${ext}`;
    }

    const response = await this.filepost.uploadFile(fileBuffer, fileName, mimeType);
    $.export("$summary", `File uploaded successfully. CDN URL: ${response.url}`);
    return response;
  },
};
