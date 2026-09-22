import contentstack from "../../contentstack.app.mjs";

export default {
  key: "contentstack-list-locale-options",
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
    contentstack,
  },
  async run({ $ }) {
    const options = await contentstack.propDefinitions.locale.options.call(this.contentstack);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
