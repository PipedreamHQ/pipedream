import topdesk from "../../topdesk.app.mjs";

export default {
  key: "topdesk-list-sla-id-options",
  name: "List SLA ID Options",
  description: "Retrieves available options for the SLA ID field.",
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
    const options = await topdesk.propDefinitions.slaId.options.call(this.topdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
