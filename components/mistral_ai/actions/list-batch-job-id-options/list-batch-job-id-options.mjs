import mistral_ai from "../../mistral_ai.app.mjs";

export default {
  key: "mistral_ai-list-batch-job-id-options",
  name: "List Batch Job ID Options",
  description: "Retrieves available options for the Batch Job ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mistral_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await mistral_ai.propDefinitions.batchJobId.options.call(this.mistral_ai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
