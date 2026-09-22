import topdesk from "../../topdesk.app.mjs";

export default {
  key: "topdesk-list-duration-id-options",
  name: "List Duration ID Options",
  description: "Retrieves available options for the Duration ID field.",
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
    const options = await topdesk.propDefinitions.durationId.options.call(this.topdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
