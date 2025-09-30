import ramp from "../../ramp_sandbox.app.mjs";
import uploadReceipt from "../../../ramp/actions/upload-receipt/upload-receipt.mjs";

export default {
  ...uploadReceipt,
  key: "ramp_sandbox-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/receipts#post-developer-v1-receipts)",
  version: "0.0.4",
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
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
};
