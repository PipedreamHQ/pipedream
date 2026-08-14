import app from "../../unirateapi.app.mjs";

export default {
  key: "unirateapi-get-vat-rates",
  name: "Get VAT Rates",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get VAT rates for a single country, or for all supported countries when no country is provided. [See the documentation](https://unirateapi.com/apidocs).",
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "countryCode",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, country,
    } = this;

    const countryCode = country
      ? country.toUpperCase()
      : undefined;

    const response = await app.getVatRates({
      $,
      country: countryCode,
    });

    if (countryCode) {
      const rate = response?.vat_data?.vat_rate;
      $.export(
        "$summary",
        `Fetched VAT rate for ${countryCode}${rate === undefined
          ? ""
          : `: ${rate}%`}`,
      );
    } else {
      const total = response?.total_countries
        ?? Object.keys(response?.vat_rates ?? {}).length;
      $.export("$summary", `Fetched VAT rates for ${total} countr${total === 1
        ? "y"
        : "ies"}`);
    }
    return response;
  },
};
