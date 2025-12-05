import bookingExperts from "../../booking_experts.app.mjs";

export default {
    key: "booking_experts-list-amenities",
    name: "List Amenities",
    description: "List amenities from BookingExperts. [See the documentation](https://developers.bookingexperts.com/reference/amenities-index)",
    version: "0.0.1",
    annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
    type: "action",
    props: {
        bookingExperts,
        page: { 
          type: "integer",
          label: "Page Number",
          optional: true,
        },
        perPage: {
          type: "integer",
          label: "Items Per Page",
          optional: true,
        },
        filters: {
          type: "object",
          label: "Filters",
          optional: true,
          description: "Additional query params to filter amenities",
        },
    },

    async run({ $ }) {
      const params = {
        "page[number]": this.page,
        "page[size]": this.perPage,
        ...this.filters,
      };

      const { data } = await this.bookingExperts.listAmenities({
        $,
        params,
      });

      $.export("$summary", `Successfully retrieved ${data?.length ?? 0} amenities`);

      return data;
    }
}