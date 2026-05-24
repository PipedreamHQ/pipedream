import planyo_online_booking from "../../planyo_online_booking.app.mjs";

export default {
  key: "planyo_online_booking-list-resource-id-options",
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
    planyo_online_booking,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await planyo_online_booking.propDefinitions.resourceId.options
      .call(this.planyo_online_booking, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
