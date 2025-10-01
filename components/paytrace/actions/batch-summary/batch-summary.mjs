import paytrace from "../../paytrace.app.mjs";

export default {
  name: "Batch Summary",
  description: "This method can be used to export a summary of specific batch details or currently pending settlement details by card and transaction type. If no optional parameter is provided, the latest batch details will be returned. [See docs here](https://developers.paytrace.com/support/home#14000045456)",
  key: "paytrace-batch-summary",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        batch_number: this.batchNumber,
      },
    });
    $.export("$summary", `Batch summary(Number:${response.batch.number}) has been retrieved`);
    return response;
  },
};
