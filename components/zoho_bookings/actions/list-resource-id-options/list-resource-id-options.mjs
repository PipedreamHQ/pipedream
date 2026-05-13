import zoho_bookings from "../../zoho_bookings.app.mjs";

export default {
  key: "zoho_bookings-list-resource-id-options",
  name: "List Resource ID Options",
  description: "Retrieves available options for the Resource ID field.",
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
    const options = await zoho_bookings.propDefinitions.resourceId.options
      .call(this.zoho_bookings);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
