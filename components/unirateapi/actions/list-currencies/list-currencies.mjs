import app from "../../unirateapi.app.mjs";

export default {
  key: "unirateapi-list-currencies",
  name: "List Currencies",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List every currency code supported by UniRate for exchange rate and conversion operations. Use this to discover valid values before calling **Convert Currency** or **Get Exchange Rates**, or to check whether a currency code you already have is supported. Takes no parameters and returns the full set in a single response as `{ currencies, count }` — codes only, without currency names or rates. These are currency codes (e.g. `USD`, `EUR`, `GBP`) and are unrelated to the EU VAT country codes used by **Get VAT Rates**. [See the documentation](https://unirateapi.com/apidocs).",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.listCurrencies({
      $,
    });

    const count = response?.currencies?.length ?? 0;
    $.export("$summary", `Retrieved ${count} supported currenc${count === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
