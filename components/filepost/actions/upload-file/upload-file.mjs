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
      // Download from URL
      const res = await fetch(input);
      if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
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
