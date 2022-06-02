import paytrace from "../../paytrace.app.mjs";

export default {
  name: "List Batch Transactions",
  description: "This method can be used to export settled transaction details within a specific batch.  This method will return one or more transaction records. [See docs here](https://developers.paytrace.com/support/home#14000045558)",
  key: "paytrace-list-batch-transactions",
  version: "0.0.3",
  type: "action",
  props: {
    paytrace,
    integratorId: {
      propDefinition: [
        paytrace,
        "integratorId",
      ],
    },
    batchNumber: {
      propDefinition: [
        paytrace,
        "batchNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paytrace.getBatchTransactions({
      data: {
        integrator_id: this.integratorId,
        batch_number: this.batchNumber,
      },
      $,
    });

    this.export("$summary", "Successfully retrieved batch transactions");

    return response;
  },
};
