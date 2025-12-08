import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-get-amenity",
  name: "Get Amenity",
  description: "Retrieve a single amenity by ID. [See the documentation](https://developers.bookingexperts.com/reference/amenities-show)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bookingExperts,
    amenityId: {
      propDefinition: [
        bookingExperts,
        "amenityId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.getAmenity({
      $,
      amenityId: this.amenityId,
    });

    $.export("$summary", `Successfully retrieved amenity ${this.amenityId}`);
    return data;
  },
};
