import github from "../../github.app.mjs";

export default {
  key: "github-list-team-id-options",
  name: "List Team Id Options",
  description: "Retrieves available options for the Team Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    github,
  },
  async run({ $ }) {
    const options = await github.propDefinitions.teamId.options.call(this.github);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
