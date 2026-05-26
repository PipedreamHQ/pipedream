import resource_guru from "../../resource_guru.app.mjs";

export default {
  key: "resource_guru-list-booking-id-options",
  name: "List Booking Id Options",
  description: "Retrieves available options for the Booking Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    resource_guru,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await resource_guru.propDefinitions.bookingId.options.call(this.resource_guru, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
