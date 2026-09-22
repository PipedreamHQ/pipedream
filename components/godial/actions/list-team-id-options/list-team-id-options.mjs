import godial from "../../godial.app.mjs";

export default {
  key: "godial-list-team-id-options",
  name: "List Team ID Options",
  description: "Retrieves available options for the Team ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    godial,
  },
  async run({ $ }) {
    const options = await godial.propDefinitions.teamId.options.call(this.godial);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
