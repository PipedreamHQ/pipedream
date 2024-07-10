import ramp from "../../ramp_sandbox.app.mjs";
import { v4 as uuidv4 } from "uuid";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "ramp_sandbox-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/receipts#post-developer-v1-receipts)",
  version: "0.0.{{ts}}",
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
    const fileData = new FormData();
    const content = fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`);
    fileData.append("attachment", content);
    fileDate.append("form-data", {
      idempotency_key: uuid4(),
      transaction_id: this.transactionId,
      userId: this.userId,
    });

    const response = await this.ramp.uploadReceipt({
      $,
      data: fileData,
      headers: fileData.getHeaders(),
    });
    $.export("$summary", `Successfully uploaded receipt for transaction ID: ${this.transactionId}`);
    return response;
  },
};
