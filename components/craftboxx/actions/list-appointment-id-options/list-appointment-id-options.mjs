import craftboxx from "../../craftboxx.app.mjs";

export default {
  key: "craftboxx-list-appointment-id-options",
  name: "List Appointment ID Options",
  description: "Retrieves available options for the Appointment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    craftboxx,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await craftboxx.propDefinitions.appointmentId.options.call(this.craftboxx, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
