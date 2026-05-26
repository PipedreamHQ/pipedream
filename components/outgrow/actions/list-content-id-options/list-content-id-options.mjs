import outgrow from "../../outgrow.app.mjs";

export default {
  key: "outgrow-list-content-id-options",
  name: "List Content ID Options",
  description: "Retrieves available options for the Content ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    outgrow,
  },
  async run({ $ }) {
    const options = await outgrow.propDefinitions.contentId.options.call(this.outgrow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
