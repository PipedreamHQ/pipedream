import paytrace from "../../paytrace.app.mjs";

export default {
  name: "Batch Summary",
  description: "This method can be used to export a summary of specific batch details or currently pending settlement details by card and transaction type.  If no optional parameter is provided, the latest batch details will be returned.",
  key: "paytrace-batch-summary",
  version: "0.0.1",
  type: "action",
  props: {
    paytrace,
    batchNumber: {
      propDefinition: [
        paytrace,
        "batchNumber",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paytrace.batchSummary({
      $,
      data: {
        batchNumber: this.batchNumber,
      },
    });
    $.export("$summary", `Batch summary(Number:${response.batch.number}) has been retrieved`);
    return response;
  },
};
