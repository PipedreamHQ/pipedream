import docparser from "../../docparser.app.mjs";

export default {
  key: "docparser-list-parser-id-options",
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
    docparser,
  },
  async run({ $ }) {
    const options = await docparser.propDefinitions.parserId.options.call(this.docparser);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
