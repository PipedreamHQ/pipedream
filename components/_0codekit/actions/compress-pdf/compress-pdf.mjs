import { getFileStream } from "@pipedream/platform";
import _0codekit from "../../_0codekit.app.mjs";

export default {
  key: "_0codekit-compress-pdf",
  name: "Compress PDF",
  description: "Compresses a PDF using the specified URL or file reference. [See the documentation](https://documenter.getpostman.com/view/18297710/UVkntwBv#fdcb09dc-c316-4b80-b523-5a1f3afac1e6)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _0codekit,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to compress. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
      format: "file-ref",
    },
    fileName: {
      type: "string",
      label: "Filename",
      description: "File name of the compressed file",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const stream = await getFileStream(this.file);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const response = await this._0codekit.compressPdf({
      $,
      data: {
        buffer: buffer.toString("base64"),
        fileName: this.fileName,
        getAsUrl: true,
      },
    });
    $.export("$summary", `Successfully compressed PDF from: ${this.file}`);
    return response;
  },
};
