import docsbot_ai from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-list-team-id-options",
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
    docsbot_ai,
  },
  async run({ $ }) {
    const options = await docsbot_ai.propDefinitions.teamId.options.call(this.docsbot_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
