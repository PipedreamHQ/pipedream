import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-list-employment-status-id-options",
  name: "List Employment Status ID Options",
  description: "Retrieves available options for the Employment Status ID field.",
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
    const options = await talenthr.propDefinitions.employmentStatusId.options
      .call(this.talenthr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
