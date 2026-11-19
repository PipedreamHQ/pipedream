import { ConfigurationError } from "@pipedream/platform";
import { MAX_ITEMS_PER_REQUEST } from "../../common/constants.mjs";
import { parseStringList } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-company-signals",
  name: "Get Company Signals By IDs",
  description: "Retrieve company signals (hiring surges, headcount and website-traffic changes, IT spend, news events, intent topics and more) for up to 100 Lusha companies by ID. Get company IDs from the `id` field of **Search Companies** or **Enrich Companies** results. To look companies up by domain or name instead, use **Search Company Signals**. Credits are charged per matched signal per company; a company with no matching signals is not charged. Each item in `results` can carry an `error` (e.g. `NOT_FOUND`) instead of signals. [See the documentation](https://docs.lusha.com/api-reference/signals/company-signals)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    lusha,
    companyIds: {
      propDefinition: [
        lusha,
        "companyIds",
      ],
      label: "Company IDs",
      description: "Up to 100 Lusha company IDs to get signals for, taken from the `id` field of **Search Companies** results, e.g. `[\"16303253\"]`",
    },
    signals: {
      propDefinition: [
        lusha,
        "companySignalTypes",
      ],
    },
    startDate: {
      propDefinition: [
        lusha,
        "startDate",
      ],
      description: "Only return signals on or after this date, in `YYYY-MM-DD` format, e.g. `2025-01-01`. `linkedinActivityIntent` is always limited to the last 90 days.",
    },
  },
  async run({ $ }) {
    const ids = parseStringList(this.companyIds);
    if (!ids?.length || ids.length > MAX_ITEMS_PER_REQUEST) {
      throw new ConfigurationError(`Provide between 1 and ${MAX_ITEMS_PER_REQUEST} company IDs.`);
    }

    const response = await this.lusha.getCompanySignalsById({
      $,
      data: {
        ids,
        signalTypes: this.signals,
        startDate: this.startDate,
      },
    });
    const count = response.results?.length ?? 0;
    $.export("$summary", `Retrieved signals for ${count} compan${count === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};
