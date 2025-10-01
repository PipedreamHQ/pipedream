import ramp from "../../ramp.app.mjs";
import { v4 as uuidv4 } from "uuid";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "ramp-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/receipts#post-developer-v1-receipts)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ramp,
    transactionId: {
      propDefinition: [
        ramp,
        "transactionId",
      ],
    },
    userId: {
      propDefinition: [
        ramp,
        "userId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const form = `--${boundary}\r\n` +
      "Content-Disposition: form-data; name=\"idempotency_key\"\r\n\r\n" +
      `${uuidv4()}\r\n` +
      `--${boundary}\r\n` +
      "Content-Disposition: form-data; name=\"transaction_id\"\r\n\r\n" +
      `${this.transactionId}\r\n` +
      `--${boundary}\r\n` +
      "Content-Disposition: form-data; name=\"user_id\"\r\n\r\n" +
      `${this.userId}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: attachment; name="receipt"; filename="${this.filePath.split("/").pop()}"\r\n\r\n`;

    const stream = await getFileStream(this.filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fileContent = Buffer.concat(chunks);

    const formEnd = `\r\n--${boundary}--`;

    const data = Buffer.concat([
      Buffer.from(form, "utf8"),
      fileContent,
      Buffer.from(formEnd, "utf8"),
    ]);

    const response = await this.ramp.uploadReceipt({
      $,
      data,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": data.length,
      },
    });
    $.export("$summary", `Successfully uploaded receipt for transaction ID: ${this.transactionId}`);
    return response;
  },
};
