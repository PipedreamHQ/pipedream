import microsoft_dynamics_365_sales from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-list-appointment-category-options",
  name: "List Appointment Category Options",
  description: "Retrieves available options for the Category of appointment field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_dynamics_365_sales,
  },
  async run({ $ }) {
    const options = await microsoft_dynamics_365_sales.propDefinitions.appointmentCategory.options
      .call(this.microsoft_dynamics_365_sales);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
