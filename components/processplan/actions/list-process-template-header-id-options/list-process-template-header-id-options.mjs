import processplan from "../../processplan.app.mjs";

export default {
  key: "processplan-list-process-template-header-id-options",
  name: "List Process Options",
  description: "Retrieves available options for the Process field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    processplan,
  },
  async run({ $ }) {
    const options = await processplan.propDefinitions.processTemplateHeaderId.options
      .call(this.processplan);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
