import clinchpad from "../../clinchpad.app.mjs";

export default {
  key: "clinchpad-list-pipeline-id-options",
  name: "List Pipeline ID Options",
  description: "Retrieves available options for the Pipeline ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clinchpad,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await clinchpad.propDefinitions.pipelineId.options.call(this.clinchpad, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
