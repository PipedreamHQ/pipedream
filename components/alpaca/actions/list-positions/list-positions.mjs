import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-list-positions",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "List Positions",
  description: "Retrieves a list of the account’s open positions, [See the docs](https://alpaca.markets/docs/api-references/trading-api/positions/#get-open-positions)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
  },
  async run ({ $ }) {
    const response = await this.app.getPositions({
      $,
      isPaperAPI: this.isPaperAPI,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${response.length} position${response.length == 1 ? "" : "s"} has been retrieved.`);
    return response;
  },
};
