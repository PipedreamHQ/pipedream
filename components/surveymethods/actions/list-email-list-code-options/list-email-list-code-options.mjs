import surveymethods from "../../surveymethods.app.mjs";

export default {
  key: "surveymethods-list-email-list-code-options",
  name: "List Email List Code Options",
  description: "Retrieves available options for the Email List Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveymethods,
  },
  async run({ $ }) {
    const options = await surveymethods.propDefinitions.emailListCode.options
      .call(this.surveymethods);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
