import { ConfigurationError } from "@pipedream/platform";
import apify from "../../apify.app.mjs";
import {
  buildActorInput,
  formatCount,
} from "../../common/utils.mjs";
import { runSyncGetDatasetItems } from "../../common/run-sync.mjs";

const KEYWORD_SEARCH_VOLUME_ACTOR_ID = "vncntlabs~keyword-search-volume";

export default {
  key: "apify-get-keyword-search-volume",
  name: "Get Keyword Search Volume",
  description: "Look up monthly search volume, cost per click, competition and a 12-month trend for a list of keywords on Google, Amazon, or both. Returns one result per keyword. Characters Google rejects, and emoji, are reported as skipped and are not charged. Trademark screening is included unless you turn it off, and it is an automated screen, not legal advice. [See the documentation](https://apify.com/vncntlabs/keyword-search-volume)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    apify,
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to look up, one per item (up to 50,000 per run). Case and extra spaces are ignored and duplicates are looked up once. Max 80 characters and 10 words each. e.g. `[\"funny cat shirt\", \"teacher gift\"]`.",
    },
    sources: {
      type: "string[]",
      label: "Data Sources",
      description: "Where to get search volume. Leave empty to use every source available for the country. Amazon volume is available for US, UK, CA, AU, DE, FR, IT, ES, NL, AT, IN, MX, SG, AE, SA and EG. e.g. `[\"google\"]`.",
      optional: true,
      options: [
        {
          label: "Google search volume (cost per click, competition, trend)",
          value: "google",
        },
        {
          label: "Amazon search volume",
          value: "amazon",
        },
      ],
    },
    location: {
      type: "string",
      label: "Country",
      description: "Country name, 2-letter code, or location code. e.g. `United States`, `GB`, or `2840`.",
      optional: true,
      default: "United States",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code or name. Leave empty for English where available, otherwise the market's main language. e.g. `en` or `de`.",
      optional: true,
    },
    trademarkCheck: {
      type: "boolean",
      label: "Trademark Screening",
      description: "Screen every keyword against live US federal trademarks in print-on-demand product classes. Adds a risk level, matched marks, owners and record links. This is automated screening, not legal advice. e.g. `true`.",
      optional: true,
      default: true,
    },
    trademarkClasses: {
      type: "string[]",
      label: "Trademark Classes",
      description: "USPTO classes to screen. Leave empty for the print-on-demand default (025 clothing, 021 mugs, 016 paper, stickers and books, 009 phone cases, 014 jewelry, 018 bags, 020 decor, 024 textiles, 028 toys). A product word in the keyword, such as shirt or mug, narrows the classes. e.g. `[\"025\", \"016\"]`.",
      optional: true,
    },
    maxTotalChargeUsd: {
      type: "string",
      label: "Maximum Charge (USD)",
      description: "Optional hard cap in US dollars. The run looks up only as many keywords as fit under the cap, then stops. The Apify account max cost per run is also respected. e.g. `5` or `12.5`.",
      optional: true,
    },
    trendMonths: {
      type: "integer",
      label: "Months of History",
      description: "How many months of Google monthly search volume to include per keyword, newest first. e.g. `12`.",
      optional: true,
      default: 12,
    },
  },
  async run({ $ }) {
    if (!this.keywords?.length) {
      throw new ConfigurationError("Provide at least one keyword, e.g. `funny cat shirt`.");
    }

    let maxTotalChargeUsd;
    const rawCharge = this.maxTotalChargeUsd;
    if (rawCharge !== undefined && rawCharge !== null && String(rawCharge).trim() !== "") {
      maxTotalChargeUsd = Number(rawCharge);
      if (!Number.isFinite(maxTotalChargeUsd)) {
        throw new ConfigurationError("Maximum charge must be a number of US dollars, e.g. `5` or `12.5`.");
      }
    }

    const input = buildActorInput({
      keywords: this.keywords,
      sources: this.sources,
      location: this.location,
      language: this.language,
      trademarkCheck: this.trademarkCheck,
      trademarkClasses: this.trademarkClasses,
      maxTotalChargeUsd,
      trendMonths: this.trendMonths,
    });
    const items = await runSyncGetDatasetItems(this.apify, {
      actorId: KEYWORD_SEARCH_VOLUME_ACTOR_ID,
      input,
    });

    $.export(
      "$summary",
      `Successfully retrieved search volume for ${formatCount(items.length, "keyword", "keywords")}`,
    );
    return items;
  },
};
