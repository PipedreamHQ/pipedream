import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-close-position",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Close Position",
  description: "Closes (liquidates) the account’s open position. Works for both long and short positions, [See the docs](https://alpaca.markets/docs/api-references/trading-api/positions/#close-a-position)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
    positionSymbol: {
      propDefinition: [
        app,
        "positionSymbol",
        (configuredProps) => ({
          isPaperAPI: configuredProps.isPaperAPI,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const response = await this.app.closePosition({
      $,
      isPaperAPI: this.isPaperAPI,
      symbol: this.positionSymbol,
    });
    $.export("$summary", `Position(Symbol:${this.positionSymbol}) has been closed.`);
    return response;
  },
};
