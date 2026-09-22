import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-list-booking-status-id-options",
  name: "List Booking Status ID Options",
  description: "Retrieves available options for the Booking Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    limoexpress,
  },
  async run({ $ }) {
    const options = await limoexpress.propDefinitions.bookingStatusId.options
      .call(this.limoexpress);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
