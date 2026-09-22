import abyssale from "../../abyssale.app.mjs";

export default {
  key: "abyssale-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves available options for the Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    abyssale,
  },
  async run({ $ }) {
    const options = await abyssale.propDefinitions.templateId.options.call(this.abyssale);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
