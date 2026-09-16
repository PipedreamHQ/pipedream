import ramp from "../../ramp_sandbox.app.mjs";
import getTransaction from "@pipedream/ramp/actions/get-transaction/get-transaction.mjs";

export default {
  ...getTransaction,
  key: "ramp_sandbox-get-transaction",
  name: "Get Transaction",
  description: "Retrieve a single Ramp Sandbox transaction by ID. Run the **List Transactions** action first to find a valid transaction ID. Example: given a transaction id from **List Transactions**, returns the full transaction — e.g. merchant `Facebook Ads`, amount `$135.00`, category `Advertising`, plus line items and accounting detail. [See the documentation](https://docs.ramp.com/developer-api/v1/api/transactions#get-developer-v1-transactions-transaction-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    ramp,
    transactionId: {
      type: "string",
      label: "Transaction ID",
      description: "The ID of the transaction to retrieve — a UUID, e.g. `c74326d3-a6b3-4a88-9a0c-4b61850784cd`. Run the **List Transactions** action to find this value.",
    },
  },
};
