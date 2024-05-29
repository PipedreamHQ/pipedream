import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-find-rental-listings",
  name: "Find Rental Listings",
  description: "Finds rental listings in a geographical area that fulfills specific criteria. [See the documentation](https://developers.rentcast.io/reference/rental-listings-long-term)",
  version: "0.0.1",
  type: "action",
  props: {
    rentcast,
    geoLocation: {
      propDefinition: [
        rentcast,
        "geoLocation",
      ],
    },
    searchCriteria: {
      propDefinition: [
        rentcast,
        "searchCriteria",
      ],
    },
    sortBy: {
      propDefinition: [
        rentcast,
        "sortBy",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rentcast.findRentalListings({
      geoLocation: this.geoLocation,
      searchCriteria: this.searchCriteria,
      sortBy: this.sortBy,
    });
    $.export("$summary", "Successfully found rental listings");
    return response;
  },
};
