import invoiceTariff from "../../invoice_tariff.app.mjs";

export default {
  key: "invoice_tariff-search-hts-codes",
  name: "Search HTS Codes",
  description: "Search the U.S. Harmonized Tariff Schedule (HTS) and return matching 8-digit codes with their current MFN general duty rates. Use it to resolve the right HTS code for a product before quoting a landed cost, classifying an item, or preparing a commercial invoice. Matches HTS code prefixes (e.g. `8471` for automatic data processing machines) and description phrases (e.g. `monitors`). Returns up to 12 results, with code-prefix matches ranked first. To check whether any upcoming rate changes affect a returned code, follow up with **Get Latest Tariff Updates**. [See the documentation](https://invoicetariff.com/hts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    invoiceTariff,
    query: {
      type: "string",
      label: "Query",
      description: "The HTS code prefix or description phrase to search for, e.g. `8471` (automatic data processing machines) or `cotton`. Use the longest code prefix you know for the narrowest matches.",
    },
  },
  async run({ $ }) {
    const query = this.query.trim();
    const { results } = await invoiceTariff.searchHtsCodes($, query);
    $.export("summary", results.length
      ? `Found ${results.length} HTS code(s) for "${query}"`
      : `No HTS codes found for "${query}"`);
    return results;
  },
};
