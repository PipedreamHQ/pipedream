import acuity_scheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-list-form-id-options",
  name: "List Form ID Options",
  description: "Retrieves available options for the Form ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acuity_scheduling,
  },
  async run({ $ }) {
    const options = await acuity_scheduling.propDefinitions.formId.options
      .call(this.acuity_scheduling);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
