import app from "../../taxjar.app.mjs";

export default {
  key: "taxjar-calculate-sales-tax",
  name: "Calculate Sales Tax",
  description: "Shows the sales tax that should be collected for a given order. [See the documentation](https://developers.taxjar.com/api/reference/#taxes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    exemptionType: {
      propDefinition: [
        app,
        "exemptionType",
      ],
    },
    fromCountry: {
      propDefinition: [
        app,
        "fromCountry",
      ],
    },
    fromZip: {
      propDefinition: [
        app,
        "fromZip",
      ],
    },
    fromState: {
      propDefinition: [
        app,
        "fromState",
      ],
    },
    fromCity: {
      propDefinition: [
        app,
        "fromCity",
      ],
    },
    fromStreet: {
      propDefinition: [
        app,
        "fromStreet",
      ],
    },
    toCountry: {
      propDefinition: [
        app,
        "toCountry",
      ],
    },
    toZip: {
      propDefinition: [
        app,
        "toZip",
      ],
    },
    toState: {
      propDefinition: [
        app,
        "toState",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    shipping: {
      propDefinition: [
        app,
        "shipping",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.calculateSalesTax({
      $,
      data: {
        exemption_type: this.exemptionType,
        from_country: this.fromCountry,
        from_zip: this.fromZip,
        from_state: this.fromState,
        from_city: this.fromCity,
        from_street: this.fromStreet,
        to_country: this.toCountry,
        to_zip: this.toZip,
        to_state: this.toState,
        amount: this.amount,
        shipping: this.shipping,
      },
    });
    $.export("$summary", `Successfully calculated sales tax. Amount to collect: ${response.tax.amount_to_collect}`);
    return response;
  },
};
