import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-list-pipeline-id-options",
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
    vectorshift,
  },
  async run({ $ }) {
    const options = await vectorshift.propDefinitions.pipelineId.options.call(this.vectorshift, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
