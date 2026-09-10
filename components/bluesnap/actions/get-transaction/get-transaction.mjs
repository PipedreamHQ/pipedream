// x-pd-ai: optimized
import bluesnap from "../../bluesnap.app.mjs";

export default {
  key: "bluesnap-get-transaction",
  name: "Get Transaction",
  description: "Retrieve a single BlueSnap transaction by ID. Use **List Transactions** first to find a transaction ID. [See the documentation](https://developers.bluesnap.com/v8976-JSON/reference/retrieve)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bluesnap,
    transactionId: {
      propDefinition: [
        bluesnap,
        "transactionId",
      ],
      description: "The numeric transaction ID to retrieve (e.g. `1023190247`). Run the **List Transactions** action first to find valid IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.bluesnap.getTransaction({
      $,
      transactionId: this.transactionId,
    });

    $.export("$summary", `Retrieved transaction ${this.transactionId}`);
    return response;
  },
};
