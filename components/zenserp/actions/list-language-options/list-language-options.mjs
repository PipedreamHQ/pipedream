import zenserp from "../../zenserp.app.mjs";

export default {
  key: "zenserp-list-language-options",
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
    zenserp,
  },
  async run({ $ }) {
    const options = await zenserp.propDefinitions.language.options.call(this.zenserp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
