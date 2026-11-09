import { customer } from "../../common/resources/customer.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(customer),
  key: "google_ads-create-customer-report",
  name: "Create Customer Report",
  description: "Run a Google Ads customer-level GAQL report via SearchStream (all rows, no 10,000-row cap). Field/segment/metric names are validated locally before any API call. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v25/GoogleAdsService/SearchStream?transport=rest)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
};
