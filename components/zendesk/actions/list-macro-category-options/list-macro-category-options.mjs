import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-macro-category-options",
  name: "List Macro Category Options",
  description: "Retrieves available options for the Macro Category field.",
  version: "0.0.6",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
  },
  async run({ $ }) {
    const options = await zendesk.propDefinitions.macroCategory.options.call(this.zendesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
