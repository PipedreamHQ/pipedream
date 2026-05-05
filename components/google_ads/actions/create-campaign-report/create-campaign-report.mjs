import { campaign } from "../../common/resources/campaign.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(campaign),
  key: "google_ads-create-campaign-report",
  name: "Create Campaign Report",
  description: "Creates a report for the Campaign resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
};
