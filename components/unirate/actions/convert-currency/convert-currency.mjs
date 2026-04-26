import app from "../../unirate.app.mjs";

export default {
  key: "unirate-convert-currency",
  name: "Convert Currency",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Convert an amount from one currency to another at the latest rate. [See the documentation](https://unirateapi.com/docs).",
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "From",
      description: "The source currency code.",
    },
    to: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "To",
      description: "The target currency code.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount to convert.",
      default: "1",
    },
  },
  async run({ $ }) {
    const {
      app, from, to, amount,
    } = this;

    const response = await app.convert({
      $,
      from,
      to,
      amount,
    });

    $.export(
      "$summary",
      `Converted ${amount} ${from} → ${response?.result ?? "?"} ${to}`,
    );
    return response;
  },
};
