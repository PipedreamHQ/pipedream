import app from "../../unirate.app.mjs";

export default {
  key: "unirate-get-exchange-rates",
  name: "Get Exchange Rates",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get the latest exchange rate(s) for a base currency. Returns a single rate when a target is provided, or all rates keyed by currency code when omitted. [See the documentation](https://unirateapi.com/docs).",
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "From",
      description: "The base currency code. Defaults to `USD`.",
      optional: true,
    },
    to: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "To",
      description: "Optional target currency code. If omitted, all rates for the base currency are returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, from, to,
    } = this;

    const response = await app.getRates({
      $,
      from,
      to,
    });

    const base = from || "USD";
    const rateCount = response?.rates
      ? Object.keys(response.rates).length
      : 0;
    $.export(
      "$summary",
      to
        ? `Fetched ${base}→${to} rate: ${response?.rate ?? "?"}`
        : `Fetched ${rateCount} rate(s) for ${base}`,
    );
    return response;
  },
};
