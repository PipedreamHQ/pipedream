import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-get-market-statistics",
  name: "Get Market Statistics",
  description: "Get aggregate rental statistics and listing trends for a single US zip code. [See the documentation](https://developers.rentcast.io/reference/market-statistics)",
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
    historyRange: {
      type: "integer",
      label: "History Range",
      description: "The time range for historical record entries, in months (defaults to 12)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      rentcast, ...params
    } = this;
    const response = await rentcast.getMarketStatistics({
      $,
      params,
    });
    $.export("$summary", `Fetched market statistics for zip code ${this.zipCode}`);
    return response;
  },
};
