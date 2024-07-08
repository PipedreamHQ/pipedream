import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-upload-receipt",
  name: "Upload Receipt",
  description: "Uploads a receipt for a given transaction and user. [See the documentation](https://docs.ramp.com/developer-api/v1/overview/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ramp,
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The ID of the transaction for which the receipt is being uploaded",
      required: true,
    },
    userId: {
      propDefinition: [
        ramp,
        "userId",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description: "The file to upload",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.ramp.uploadReceipt(this, this.transactionId, this.userId, this.file);
    $.export("$summary", `Successfully uploaded receipt for transaction ID: ${this.transactionId}`);
    return response;
  },
};
