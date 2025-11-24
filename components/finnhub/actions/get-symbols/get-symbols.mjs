import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-symbols",
  name: "Get Symbols",
  description: "Get a list of supported stock symbols. [See the documentation](https://finnhub.io/docs/api/stock-symbols)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    exchange: {
      propDefinition: [
        app,
        "exchange",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    mic: {
      propDefinition: [
        app,
        "mic",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSymbols({
      $,
      params: {
        exchange: this.exchange,
        currency: this.currency,
        mic: this.mic,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.length + " symbols");
    return response;
  },
};
