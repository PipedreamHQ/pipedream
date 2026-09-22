import booking_experts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-rentable-segment-id-options",
  name: "List Rentable Segment ID Options",
  description: "Retrieves available options for the Rentable Segment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    booking_experts,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await booking_experts.propDefinitions.rentableSegmentId.options
      .call(this.booking_experts, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
