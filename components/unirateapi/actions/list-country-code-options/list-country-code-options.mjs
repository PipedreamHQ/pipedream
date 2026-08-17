import unirateapi from "../../unirateapi.app.mjs";

export default {
  key: "unirateapi-list-country-code-options",
  name: "List Country Code Options",
  description: "Retrieves the valid options for the Country Code field used by **Get VAT Rates**. Returns one entry per supported country as `{ label, value }`, where `value` is the code to pass as Country Code. These follow the EU VAT convention rather than ISO 3166-1 alpha-2 — Greece is `EL` (not `GR`) and the United Kingdom is `UK` (not `GB`) — so call this first rather than assuming an ISO code. [See the documentation](https://unirateapi.com/apidocs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    unirateapi,
  },
  async run({ $ }) {
    const { vat_rates: vatRates = {} } = await this.unirateapi.getVatRates({
      $,
    });

    const options = Object.values(vatRates).map(({
      country_code: value, country_name: label,
    }) => ({
      label: label || value,
      value,
    }));

    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
