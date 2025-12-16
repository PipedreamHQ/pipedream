import oanda from "../../oanda.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "oanda-list-trades",
  name: "List Trades",
  description: "Retrieve a list of trades for an account. [See the documentation](https://developer.oanda.com/rest-live-v20/trade-ep/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    oanda,
    isDemo: {
      propDefinition: [
        oanda,
        "isDemo",
      ],
    },
    accountId: {
      propDefinition: [
        oanda,
        "accountId",
        (c) => ({
          isDemo: c.isDemo,
        }),
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "Filter trades by state",
      options: constants.TRADE_STATES,
      optional: true,
    },
    instrument: {
      propDefinition: [
        oanda,
        "instrument",
      ],
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The maximum number of Trades to return. [default=50, maximum=500]",
      optional: true,
    },
    beforeId: {
      type: "string",
      label: "Before ID",
      description: "The maximum Trade ID to return. If not provided the most recent Trades in the Account are returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.oanda.listTrades({
      $,
      isDemo: this.isDemo,
      accountId: this.accountId,
      params: {
        state: this.state,
        instrument: this.instrument,
        count: this.count,
        beforeID: this.beforeId,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.trades.length} trade${response.trades.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
