import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-process-batch",
  name: "Process Batch",
  description: "Start processing all payments in a batch. This action is irreversible — payments cannot be cancelled after processing begins. [See the documentation](https://developers.trolley.com/api/#start-processing-a-batch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.trolley.startBatchProcessing({
      $,
      batchId: this.batchId,
    });
    $.export("$summary", `Successfully started processing batch ${this.batchId}`);
    return response;
  },
};
