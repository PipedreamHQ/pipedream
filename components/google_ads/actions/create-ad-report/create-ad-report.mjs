import { ad } from "../../common/resources/ad.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(ad),
  key: "google_ads-create-ad-report",
  name: "Create Ad Report",
  description: "Run a Google Ads ad-level GAQL report via SearchStream (all rows, no 10,000-row cap). Field/segment/metric names are validated locally before any API call. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/SearchStream?transport=rest)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
};
