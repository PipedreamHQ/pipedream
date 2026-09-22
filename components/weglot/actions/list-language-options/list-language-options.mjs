import weglot from "../../weglot.app.mjs";

export default {
  key: "weglot-list-language-options",
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
    weglot,
  },
  async run({ $ }) {
    const options = await weglot.propDefinitions.language.options.call(this.weglot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
