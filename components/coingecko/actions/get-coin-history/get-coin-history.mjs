import app from "../../coingecko.app.mjs";

export default {
  key: "coingecko-get-coin-history",
  name: "Get Coin History",
  description: "Get historical data (price, market cap, and volume) for a coin on a specific date. [See the documentation](https://docs.coingecko.com/v3.0.1/reference/coins-id-history)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    coinId: {
      propDefinition: [
        app,
        "coinId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date to retrieve historical data for, in `dd-mm-yyyy` format (e.g. `30-12-2023`).",
    },
    localization: {
      type: "boolean",
      label: "Include Localization",
      description: "Include localized language data in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coinId, date, localization,
    } = this;
    const response = await this.app.getCoinHistory({
      $,
      coinId,
      params: {
        date,
        localization,
      },
    });
    $.export("$summary", `Successfully retrieved historical data for ${coinId} on ${date}`);
    return response;
  },
};
