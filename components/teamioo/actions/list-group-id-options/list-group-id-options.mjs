import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamioo,
  },
  async run({ $ }) {
    const options = await teamioo.propDefinitions.groupId.options.call(this.teamioo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
