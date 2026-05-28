import tisane_labs from "../../tisane_labs.app.mjs";

export default {
  key: "tisane_labs-list-language-options",
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
    tisane_labs,
  },
  async run({ $ }) {
    const options = await tisane_labs.propDefinitions.language.options.call(this.tisane_labs, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
