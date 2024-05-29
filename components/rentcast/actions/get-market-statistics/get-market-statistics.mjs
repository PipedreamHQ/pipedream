import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-get-market-statistics",
  name: "Get Market Statistics",
  description: "Fetches rental statistics and market trends based on a provided US zip code. [See the documentation](https://api.rentcast.io/v1/market-statistics)",
  version: "0.0.1",
  type: "action",
  props: {
    rentcast,
    zipCode: {
      propDefinition: [
        rentcast,
        "zipCode",
      ],
    },
    propertyType: {
      propDefinition: [
        rentcast,
        "propertyType",
        (c) => ({
          zipCode: c.zipCode,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rentcast.fetchRentalStatistics({
      zipCode: this.zipCode,
      propertyType: this.propertyType,
    });
    $.export("$summary", `Fetched market statistics for zip code ${this.zipCode}`);
    return response;
  },
};
