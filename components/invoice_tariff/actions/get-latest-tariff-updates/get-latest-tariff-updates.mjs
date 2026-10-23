import invoiceTariff from "../../invoice_tariff.app.mjs";

export default {
  key: "invoice_tariff-get-latest-tariff-updates",
  name: "Get Latest Tariff Updates",
  description: "Fetch the latest U.S. tariff and fee changes tracked by the Invoice Tariff Radar — a continuously updated changelog of Section 301, Section 232, IEEPA and de minimis changes with effective dates and official sources. Use it to review current and upcoming changes before quoting prices, or run it on a schedule to alert your team when new changes are published. Entries are returned newest first. To resolve the HTS codes affected by an update, follow up with **Search HTS Codes**. [See the documentation](https://invoicetariff.com/radar)",
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
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of updates to return, e.g. `10`. Leave empty to return all entries in the feed.",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const entries = await invoiceTariff.getTariffRadarFeed($);
    const result = this.limit ? entries.slice(0, this.limit) : entries;
    $.export("summary", `Fetched ${result.length} tariff update(s)`);
    return result;
  },
};
