import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-list-user-id-options",
  name: "List Assigned User Options",
  description: "Retrieves available options for the Assigned User field.",
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
    const options = await teamioo.propDefinitions.userId.options.call(this.teamioo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
