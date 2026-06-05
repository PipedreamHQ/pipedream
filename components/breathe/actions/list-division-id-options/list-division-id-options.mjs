import breathe from "../../breathe.app.mjs";

export default {
  key: "breathe-list-division-id-options",
  name: "List Division ID Options",
  description: "Retrieves available options for the Division ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breathe,
  },
  async run({ $ }) {
    const options = await breathe.propDefinitions.divisionId.options.call(this.breathe);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
