import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-retrieve-batch-summary",
  name: "Retrieve Batch Summary",
  description: "Retrieve the summary for an existing batch. [See the documentation](https://developers.trolley.com/api/#retrieve-a-batch-summary)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    batchId: {
      propDefinition: [
        trolley,
        "batchId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.trolley.getBatchSummary({
      $,
      batchId: this.batchId,
    });
    $.export("$summary", `Successfully retrieved summary for batch ${this.batchId}`);
    return response;
  },
};
