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
  description: "Get VAT rates for a single country, or for all supported countries when no country is provided. Country codes follow the EU VAT convention rather than ISO 3166-1 alpha-2 — Greece is `EL` (not `GR`) and the United Kingdom is `UK` (not `GB`). Coverage is limited to EU member states plus `UK` and `XI` (Northern Ireland), so non-EU codes such as `US` are not supported. Use **List Country Code Options** to discover valid codes. [See the documentation](https://unirateapi.com/apidocs).",
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "countryCode",
      ],
      description: "An EU VAT country code (e.g. `DE`, `FR`, `UK`). If omitted, VAT rates for all supported countries are returned.",
    },
  },
  async run({ $ }) {
    const {
      app, country,
    } = this;

    const trimmed = String(country ?? "").trim();
    const countryCode = trimmed
      ? trimmed.toUpperCase()
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
