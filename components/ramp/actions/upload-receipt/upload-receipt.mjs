import ramp from "../../ramp.app.mjs";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default {
  key: "ramp-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/receipts#post-developer-v1-receipts)",
  version: "0.0.2",
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
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
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

    const fileContent = fs.readFileSync(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);

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
