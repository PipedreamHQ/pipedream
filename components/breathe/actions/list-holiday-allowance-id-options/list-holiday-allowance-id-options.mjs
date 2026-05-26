import breathe from "../../breathe.app.mjs";

export default {
  key: "breathe-list-holiday-allowance-id-options",
  name: "List Holiday Allowance ID Options",
  description: "Retrieves available options for the Holiday Allowance ID field.",
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
    const options = await breathe.propDefinitions.holidayAllowanceId.options
      .call(this.breathe);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
