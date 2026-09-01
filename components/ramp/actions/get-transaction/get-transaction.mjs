// x-pd-ai: optimized
import ramp from "../../ramp.app.mjs";

export default {
  key: "ramp-get-transaction",
  name: "Get Transaction",
  description: "Retrieve a single Ramp transaction by ID. Run the **List Transactions** action first to find a valid transaction ID. Example: given a transaction id from **List Transactions**, returns the full transaction — e.g. merchant `Facebook Ads`, amount `$135.00`, category `Advertising`, plus line items and accounting detail. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transactions#get-developer-v1-transactions-transaction-id)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ramp,
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The ID of the transaction to retrieve — a UUID, e.g. `c74326d3-a6b3-4a88-9a0c-4b61850784cd`. Run the **List Transactions** action to find this value.",
    },
  },
  async run({ $ }) {
    const response = await this.ramp.getTransaction({
      $,
      transactionId: this.transactionId,
    });
    $.export("$summary", `Successfully retrieved transaction ${this.transactionId}`);
    return response;
  },
};
