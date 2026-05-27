import onenote from "../../onenote.app.mjs";

export default {
  key: "onenote-list-section-id-options",
  name: "List Section ID Options",
  description: "Retrieves available options for the Section ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onenote,
  },
  async run({ $ }) {
    const options = await onenote.propDefinitions.sectionId.options.call(this.onenote);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
