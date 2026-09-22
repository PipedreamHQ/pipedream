import booking_experts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-amenity-id-options",
  name: "List Amenity ID Options",
  description: "Retrieves available options for the Amenity ID field.",
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
    const options = await booking_experts.propDefinitions.amenityId.options
      .call(this.booking_experts, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
