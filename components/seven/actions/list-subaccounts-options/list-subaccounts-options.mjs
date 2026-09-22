import seven from "../../seven.app.mjs";

export default {
  key: "seven-list-subaccounts-options",
  name: "List Subaccounts Options",
  description: "Retrieves available options for the Subaccounts field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    seven,
  },
  async run({ $ }) {
    const options = await seven.propDefinitions.subaccounts.options.call(this.seven);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
