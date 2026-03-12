import { getFileStream } from "@pipedream/platform";
import _0codekit from "../../_0codekit.app.mjs";

export default {
  key: "_0codekit-read-barcode",
  name: "Read Barcode",
  description: "Reads a QR code from an image. [See the documentation](https://documenter.getpostman.com/view/18297710/UVkntwBv#84ecd80e-af50-406b-abd7-698826773500)",
  version: "0.1.1",
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
      description: "The file containing the QR code to be read. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.png`)",
      format: "file-ref",
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

    const qrCodeData = await this._0codekit.readQrCode({
      $,
      data: {
        buffer: buffer.toString("base64"),
      },
    });
    $.export("$summary", "Successfully read QR code from the provided file");
    return qrCodeData;
  },
};
