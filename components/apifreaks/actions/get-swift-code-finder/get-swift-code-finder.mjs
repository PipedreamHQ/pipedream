import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-swift-code-finder",
  name: "Find SWIFT Codes",
  description: "Fetches SWIFT codes for a given country, bank, and city. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    bank: {
      type: "string",
      label: "Bank",
      description: "Bank name (upper case) used to filter SWIFT codes. Should be used together with the country parameter. If only country and bank are provided (without city), returns the list of cities for that bank.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Gives SWIFT codes for a bank. Optionally specify the city (upper case) to narrow results to a specific city for that bank.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/swift-code/finder",
      params: {
        country: this.country,
        bank: this.bank,
        city: this.city,
      },
    });
    $.export("$summary", "Successfully executed Find SWIFT Codes");
    return response;
  },
};
