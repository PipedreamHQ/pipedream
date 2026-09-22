import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-list-tags-options",
  name: "List Tags Options",
  description: "Retrieves available options for the Tags field.",
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
    const options = await teamioo.propDefinitions.tags.options.call(this.teamioo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
