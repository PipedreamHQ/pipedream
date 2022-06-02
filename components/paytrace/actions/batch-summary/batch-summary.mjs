import paytrace from "../../paytrace.app.mjs";

export default {
  name: "Batch Summary",
  description: "This method can be used to export a summary of specific batch details or currently pending settlement details by card and transaction type.  If no optional parameter is provided, the latest batch details will be returned. [See docs here](https://developers.paytrace.com/support/home#14000045456)",
  key: "paytrace-batch-summary",
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
    const response = await this.paytrace.batchSummary({
      data: {
        integrator_id: this.integratorId,
        batch_number: this.batchNumber,
      },
      $,
    });

    this.export("$summary", "Successfully retrieved batch summary");

    return response;
  },
};
