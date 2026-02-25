import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-get-complex-prices",
  name: "Get Complex Prices",
  description: "Returns all complex prices of a master price list. [See the documentation](https://developers.bookingexperts.com/reference/administration-masterpricelist-complexprices-index)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    masterPriceListId: {
      propDefinition: [
        bookingExperts,
        "masterPriceListId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
    },
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.getComplexPrices({
      $,
      administrationId: this.administrationId,
      masterPriceListId: this.masterPriceListId,
      params: {
        "page[number]": this.page,
        "page[size]": this.perPage,
      },
    });
    $.export("$summary", `Found ${response.data.length} complex prices`);
    return response;
  },
};
