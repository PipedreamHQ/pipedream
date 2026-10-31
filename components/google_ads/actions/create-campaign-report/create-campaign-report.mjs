import { campaign } from "../../common/resources/campaign.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(campaign),
  key: "google_ads-create-campaign-report",
  name: "Create Campaign Report",
  description: "Run a Google Ads campaign-level GAQL report via SearchStream (all rows, no 10,000-row cap). Field/segment/metric names are validated locally before any API call. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/SearchStream?transport=rest)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
};
