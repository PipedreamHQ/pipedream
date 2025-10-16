import wise from "../../wise.app.mjs";

export default {
  name: "Get Exchange Rates",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "wise-get-exchange-rates",
  description: "Get an exchange rates. [See docs here](https://api-docs.wise.com/api-reference/rate#get)",
  type: "action",
  props: {
    wise,
    sourceCurrency: {
      label: "Source Currency",
      description: "The source currency",
      propDefinition: [
        wise,
        "currency",
      ],
    },
    targetCurrency: {
      label: "Target Currency",
      description: "The target currency",
      propDefinition: [
        wise,
        "currency",
        (c) => ({
          sourceCurrency: c.sourceCurrency,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wise.getExchangeRate({
      $,
      params: {
        source: this.sourceCurrency,
        target: this.targetCurrency,
      },
    });

    if (response) {
      $.export("$summary", "Successfully retrieved exchange rates");
    }

    return response;
  },
};
