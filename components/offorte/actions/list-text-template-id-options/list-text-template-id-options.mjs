import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-list-text-template-id-options",
  name: "List Text Template ID Options",
  description: "Retrieves available options for the Text Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    offorte,
  },
  async run({ $ }) {
    const options = await offorte.propDefinitions.textTemplateId.options.call(this.offorte);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
