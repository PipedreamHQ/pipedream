import { adGroup } from "../../common/resources/adGroup.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(adGroup),
  key: "google_ads-create-ad-group-report",
  name: "Create Ad Group Report",
  description: "Creates a report for the Ad Group resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
};
