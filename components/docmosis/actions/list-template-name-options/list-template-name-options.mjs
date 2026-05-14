import docmosis from "../../docmosis.app.mjs";

export default {
  key: "docmosis-list-template-name-options",
  name: "List Template Name Options",
  description: "Retrieves available options for the Template Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docmosis,
  },
  async run({ $ }) {
    const options = await docmosis.propDefinitions.templateName.options.call(this.docmosis);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
