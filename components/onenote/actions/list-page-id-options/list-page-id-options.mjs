import onenote from "../../onenote.app.mjs";

export default {
  key: "onenote-list-page-id-options",
  name: "List Page ID Options",
  description: "Retrieves available options for the Page ID field.",
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
    const options = await onenote.propDefinitions.pageId.options.call(this.onenote);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
