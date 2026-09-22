import zoho_bookings from "../../zoho_bookings.app.mjs";

export default {
  key: "zoho_bookings-list-staff-id-options",
  name: "List Staff ID Options",
  description: "Retrieves available options for the Staff ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_bookings,
  },
  async run({ $ }) {
    const options = await zoho_bookings.propDefinitions.staffId.options
      .call(this.zoho_bookings);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
