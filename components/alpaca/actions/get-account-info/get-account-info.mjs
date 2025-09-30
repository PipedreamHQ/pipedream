import app from "../../alpaca.app.mjs";

export default {
  type: "action",
  key: "alpaca-get-account-info",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get Account Info",
  description: "Returns the account info, [See the docs](https://alpaca.markets/docs/api-references/trading-api/account/)",
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
    const response = this.app.getAccountInfo({
      $,
      isPaperAPI: this.isPaperAPI,
    });
    $.export("$summary", "Account info has been retreived.");
    return response;
  },
};
