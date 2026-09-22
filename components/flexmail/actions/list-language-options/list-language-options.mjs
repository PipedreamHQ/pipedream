import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-list-language-options",
  name: "List Language Options",
  description: "Retrieves available options for the Language field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flexmail,
  },
  async run({ $ }) {
    const options = await flexmail.propDefinitions.language.options.call(this.flexmail);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
