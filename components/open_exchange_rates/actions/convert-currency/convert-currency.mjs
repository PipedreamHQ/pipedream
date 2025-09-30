import app from "../../open_exchange_rates.app.mjs";

export default {
  key: "open_exchange_rates-convert-currency",
  name: "Convert Currency",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Convert any money value from one currency to another. [See the documentation](https://docs.openexchangerates.org/reference/convert)",
  type: "action",
  props: {
    app,
    value: {
      type: "string",
      label: "Value",
      description: "The value to be converted.",
    },
    from: {
      propDefinition: [
        app,
        "currencyId",
      ],
      label: "From",
      description: "The base `from` currency.",
    },
    to: {
      propDefinition: [
        app,
        "currencyId",
      ],
      label: "To",
      description: "The target `to` currency.",
    },
  },
  async run({ $ }) {
    const {
      app,
      from,
      to,
      value,
    } = this;

    const response = await app.convertCurrency({
      $,
      from,
      to,
      value,
    });

    $.export("$summary", `The currency symbol ${from} was successfully converted to ${to}!`);
    return response;
  },
};
