import { ConfigurationError } from "@pipedream/platform";
import { MAX_ITEMS_PER_REQUEST } from "../../common/constants.mjs";
import { parseStringList } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-contact-signals",
  name: "Get Contact Signals By IDs",
  description: "Retrieve job-change signals (`promotion`, `companyChange`) for up to 100 Lusha contacts by ID. Get contact IDs from the `id` field of **Search Contacts** or **Enrich Contacts** results. To look contacts up by email or LinkedIn URL instead, use **Search Contact Signals**. Credits are charged per matched signal per contact; a contact with no matching signals is not charged. Returns one item per contact in `results`. [See the documentation](https://docs.lusha.com/api-reference/signals/contact-signals)",
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
    contactIds: {
      propDefinition: [
        lusha,
        "contactIds",
      ],
      label: "Contact IDs",
      description: "Up to 100 Lusha contact IDs to get signals for, taken from the `id` field of **Search Contacts** results, e.g. `[\"4389064624\"]`",
    },
    signals: {
      propDefinition: [
        lusha,
        "signals",
      ],
      description: "Types of contact signals to retrieve, e.g. `[\"promotion\"]`. `allSignals` returns both `promotion` and `companyChange`.",
    },
    startDate: {
      propDefinition: [
        lusha,
        "startDate",
      ],
      description: "Only return signals on or after this date, in `YYYY-MM-DD` format, e.g. `2025-01-01`",
    },
  },
  async run({ $ }) {
    const ids = parseStringList(this.contactIds);
    if (!ids?.length || ids.length > MAX_ITEMS_PER_REQUEST) {
      throw new ConfigurationError(`Provide between 1 and ${MAX_ITEMS_PER_REQUEST} contact IDs.`);
    }

    const response = await this.lusha.getContactSignalsById({
      $,
      data: {
        ids,
        signalTypes: this.signals,
        startDate: this.startDate,
      },
    });
    const count = response.results?.length ?? 0;
    $.export("$summary", `Retrieved signals for ${count} contact${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
