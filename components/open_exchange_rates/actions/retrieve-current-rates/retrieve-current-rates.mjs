import app from "../../open_exchange_rates.app.mjs";

export default {
  key: "open_exchange_rates-retrieve-current-rates",
  name: "Retrieve Current Rates",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get the latest exchange rates available. [See the documentation](https://docs.openexchangerates.org/reference/latest-json)",
  type: "action",
  props: {
    app,
    base: {
      propDefinition: [
        app,
        "currencyId",
      ],
      label: "Base",
      description: "Change base currency. `default: USD`",
    },
    symbols: {
      propDefinition: [
        app,
        "currencyId",
      ],
      type: "string[]",
      description: "A list of currency symbols you want to check.",
    },
    showAlternative: {
      type: "boolean",
      label: "Show Alternative",
      description: "Extend returned values with alternative, black market and digital currency rates.",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbols,
      showAlternative,
      ...params
    } = this;

    const response = await app.getLatestCurrency({
      $,
      params: {
        symbols: symbols.toString(),
        show_alternative: showAlternative,
        ...params,
      },
    });

    $.export("$summary", `The currency symbol${symbols.length === 1
      ? ` ${symbols} was`
      : `s ${symbols.toString()} were`} successfully fetched!`);
    return response;
  },
};
