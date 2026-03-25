import { ad } from "../../common/resources/ad.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(ad),
  key: "google_ads-create-ad-report",
  name: "Create Ad Report",
  description: "Creates a report for the Ad resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
};
