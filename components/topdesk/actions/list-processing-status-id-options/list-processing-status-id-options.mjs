import topdesk from "../../topdesk.app.mjs";

export default {
  key: "topdesk-list-processing-status-id-options",
  name: "List Processing Status ID Options",
  description: "Retrieves available options for the Processing Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    topdesk,
  },
  async run({ $ }) {
    const options = await topdesk.propDefinitions.processingStatusId.options
      .call(this.topdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
