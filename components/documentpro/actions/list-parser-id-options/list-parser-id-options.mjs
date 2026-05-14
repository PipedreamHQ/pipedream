import documentpro from "../../documentpro.app.mjs";

export default {
  key: "documentpro-list-parser-id-options",
  name: "List Parser ID Options",
  description: "Retrieves available options for the Parser ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    documentpro,
  },
  async run({ $ }) {
    const options = await documentpro.propDefinitions.parserId.options.call(this.documentpro);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
