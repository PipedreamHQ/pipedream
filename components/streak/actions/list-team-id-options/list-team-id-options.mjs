import streak from "../../streak.app.mjs";

export default {
  key: "streak-list-team-id-options",
  name: "List Team Options",
  description: "Retrieves available options for the Team field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    streak,
  },
  async run({ $ }) {
    const options = await streak.propDefinitions.teamId.options.call(this.streak);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
