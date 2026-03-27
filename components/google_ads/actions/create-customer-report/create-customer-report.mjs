import { customer } from "../../common/resources/customer.mjs";
import { createReportComponent } from "../../common/common-report.mjs";

export default {
  ...createReportComponent(customer),
  key: "google_ads-create-customer-report",
  name: "Create Customer Report",
  description: "Creates a report for the Customer resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
};
