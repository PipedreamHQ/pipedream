import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-list-seniority-options",
  name: "List Contact Seniority Levels Options",
  description: "Retrieves available options for the Contact Seniority Levels field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lusha,
  },
  async run({ $ }) {
    const options = await lusha.propDefinitions.seniority.options.call(this.lusha);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
