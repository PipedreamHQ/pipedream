import paytrace from "../../paytrace.app.mjs";

export default {
  name: "List Batch Transactions",
  description: "This method can be used to export settled transaction details within a specific batch.  This method will return one or more transaction records.",
  key: "paytrace-list-batch-transactions",
  version: "0.0.1",
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
        batchNumber: this.batchNumber,
      },
    });
    $.export("$summary", `${response.transactions} batch transactions has been retrieved`);
    return response;
  },
};
