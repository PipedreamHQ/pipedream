import paytrace from "../../paytrace.app.mjs";

export default {
  name: "List Batch Transactions",
  description: "This method can be used to export settled transaction details within a specific batch. This method will return one or more transaction records. [See docs here](https://developers.paytrace.com/support/home#14000045558)",
  key: "paytrace-list-batch-transactions",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paytrace,
    batchNumber: {
      propDefinition: [
        paytrace,
        "batchNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paytrace.listBatchTransactions({
      $,
      data: {
        batch_number: this.batchNumber,
      },
    });
    $.export("$summary", `${response.transactions} batch transactions has been retrieved`);
    return response;
  },
};
