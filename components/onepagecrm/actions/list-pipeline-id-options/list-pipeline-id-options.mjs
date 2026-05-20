import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  key: "onepagecrm-list-pipeline-id-options",
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
    onepagecrm,
  },
  async run({ $ }) {
    const options = await onepagecrm.propDefinitions.pipelineId.options.call(this.onepagecrm);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
