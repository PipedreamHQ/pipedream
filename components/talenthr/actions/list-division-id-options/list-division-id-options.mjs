import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-list-division-id-options",
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
    talenthr,
  },
  async run({ $ }) {
    const options = await talenthr.propDefinitions.divisionId.options.call(this.talenthr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
