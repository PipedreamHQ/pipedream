import announcekit from "../../announcekit.app.mjs";

export default {
  key: "announcekit-list-locale-options",
  name: "List Locale Options",
  description: "Retrieves available options for the Locale field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    announcekit,
  },
  async run({ $ }) {
    const options = await announcekit.propDefinitions.locale.options.call(this.announcekit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
