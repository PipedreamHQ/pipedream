// x-pd-ai: optimized
import ramp from "../../ramp_sandbox.app.mjs";
import uploadReceipt from "@pipedream/ramp/actions/upload-receipt/upload-receipt.mjs";

export default {
  ...uploadReceipt,
  key: "ramp_sandbox-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/reference/rest/receipts#post-developer-v1-receipts)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...uploadReceipt.props,
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
  },
};
