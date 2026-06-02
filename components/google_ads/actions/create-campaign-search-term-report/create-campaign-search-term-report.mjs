import { campaignSearchTermView } from "../../common/resources/campaignSearchTermView.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(campaignSearchTermView),
  key: "google_ads-create-campaign-search-term-report",
  name: "Create Campaign Search Term Report",
  description: "Creates a report of the search terms that triggered ads, aggregated at the campaign level (`campaign_search_term_view`). [See the documentation](https://developers.google.com/google-ads/api/fields/v21/campaign_search_term_view)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
};
