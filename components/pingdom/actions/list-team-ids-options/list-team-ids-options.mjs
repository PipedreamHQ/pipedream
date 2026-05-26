import pingdom from "../../pingdom.app.mjs";

export default {
  key: "pingdom-list-team-ids-options",
  name: "List Team Ids Options",
  description: "Retrieves available options for the Team Ids field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pingdom,
  },
  async run({ $ }) {
    const options = await pingdom.propDefinitions.teamIds.options.call(this.pingdom);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
