import { ConfigurationError } from "@pipedream/platform";
import googleAds from "../../google_ads.app.mjs";
import { DATE_RANGE_OPTIONS } from "../../common/constants.mjs";

const docLink =
  "https://developers.google.com/google-ads/api/fields/v21/keyword_view";

export default {
  key: "google_ads-get-keyword-quality-scores",
  name: "Get Keyword Quality Scores",
  description: `Retrieves current and historical quality score data (Quality Score, Ad Relevance, Landing Page Experience, Expected CTR) for keywords in a customer account. Current scores reflect the latest evaluation; historical scores are averaged over the selected date range. [See the documentation](${docLink})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    googleAds,
    accountId: {
      propDefinition: [
        googleAds,
        "accountId",
      ],
    },
    customerClientId: {
      propDefinition: [
        googleAds,
        "customerClientId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      optional: true,
    },
    campaignId: {
      propDefinition: [
        googleAds,
        "campaignId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "Filter results to a specific campaign. Use the **List Campaigns** action to discover options.",
      optional: true,
    },
    adGroupId: {
      propDefinition: [
        googleAds,
        "adGroupId",
        ({
          accountId, customerClientId,
        }) => ({
          accountId,
          customerClientId,
        }),
      ],
      description: "Filter results to a specific ad group. Use the **List Ad Groups** action to discover options.",
      optional: true,
    },
    dateRange: {
      type: "string",
      label: "Date Range",
      description: "The date range for historical quality score metrics (`metrics.historical_*`). Current quality scores (`quality_info.*`) are always the latest values regardless of this setting.",
      options: DATE_RANGE_OPTIONS.filter(({ value }) => value !== "CUSTOM"),
      default: "LAST_30_DAYS",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      customerClientId,
      campaignId,
      adGroupId,
      dateRange,
    } = this;

    if (campaignId && adGroupId) {
      throw new ConfigurationError(
        "Specify either **Campaign** or **Ad Group** as a filter, not both.",
      );
    }

    const { results } = await this.googleAds.listKeywordQualityScores({
      $,
      accountId,
      customerClientId,
      campaignId,
      adGroupId,
      dateRange,
    });

    const items = results ?? [];
    $.export(
      "$summary",
      `Successfully retrieved quality scores for ${items.length} keyword${items.length === 1
        ? ""
        : "s"}.`,
    );
    return items;
  },
};
