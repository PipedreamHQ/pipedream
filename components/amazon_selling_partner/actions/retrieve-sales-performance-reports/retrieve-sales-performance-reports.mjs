import amazonSellingPartner from "../../amazon_selling_partner.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "amazon_selling_partner-retrieve-sales-performance-reports",
  name: "Retrieve Sales Performance Reports",
  description: "Fetches sales reports for visualization in third-party dashboarding tools. [See the documentation](https://developer-docs.amazon.com/sp-api/reference/getordermetrics)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    amazonSellingPartner,
    marketplaceId: {
      propDefinition: [
        amazonSellingPartner,
        "marketplaceId",
      ],
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "A time interval used for selecting order metrics. This takes the form of two dates separated by two hyphens (first date is inclusive; second date is exclusive). Dates are in ISO8601 format and must represent absolute time (either Z notation or offset notation). Example: `2018-09-01T00:00:00-07:00--2018-09-04T00:00:00-07:00` requests order metrics for Sept 1st, 2nd and 3rd in the -07:00 zone.",
    },
    granularity: {
      type: "string",
      label: "Granularity",
      description: "The granularity of the grouping of order metrics, based on a unit of time",
      options: [
        "Hour",
        "Day",
        "Week",
        "Month",
        "Year",
        "Total",
      ],
    },
    granularityTimeZone: {
      type: "string",
      label: "Granularity Time Zone",
      description: "An IANA-compatible time zone for determining the day boundary. Required when specifying a granularity value greater than Hour.",
      optional: true,
    },
    buyerType: {
      type: "string",
      label: "Buyer Type",
      description: "Filters the results by the buyer type that you specify, B2B (business to business) or B2C (business to customer). Example: B2B, if you want the response to include order metrics for only B2B buyers.",
      options: [
        "All",
        "B2B",
        "B2C",
      ],
      optional: true,
    },
    fulfillmentNetwork: {
      type: "string",
      label: "Fulfillment Network",
      description: "Filters the results by the fulfillment network that you specify, MFN (merchant fulfillment network) or AFN (Amazon fulfillment network). Do not include this filter if you want the response to include order metrics for all fulfillment networks. Example: AFN, if you want the response to include order metrics for only Amazon fulfillment network.",
      optional: true,
    },
    firstDayOfWeek: {
      type: "string",
      label: "First Day of Week",
      description: "Specifies the day that the week starts on when granularity=Week, either Monday or Sunday. Default: Monday. Example: Sunday, if you want the week to start on a Sunday.",
      options: [
        "Monday",
        "Sunday",
      ],
      optional: true,
    },
    asin: {
      type: "string",
      label: "ASIN",
      description: "Filters the results by the ASIN that you specify. Specifying both ASIN and SKU returns an error. Do not include this filter if you want the response to include order metrics for all ASINs. Example: B0792R1RSN, if you want the response to include order metrics for only ASIN B0792R1RSN.",
      optional: true,
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Filters the results by the SKU that you specify. Specifying both ASIN and SKU returns an error. Do not include this filter if you want the response to include order metrics for all SKUs. Example: TestSKU, if you want the response to include order metrics for only SKU TestSKU.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.asin && this.sku) {
      throw new ConfigurationError("Cannot specify both ASIN and SKU parameters");
    }
    const { payload } = await this.amazonSellingPartner.getOrderMetrics({
      $,
      params: {
        marketplaceIds: this.marketplaceId,
        interval: this.interval,
        granularity: this.granularity,
        granularityTimeZone: this.granularityTimeZone,
        buyerType: this.buyerType,
        fulfillmentNetwork: this.fulfillmentNetwork,
        firstDayOfWeek: this.firstDayOfWeek,
        asin: this.asin,
        sku: this.sku,
      },
    });
    $.export("$summary", "Fetched sales performance reports");
    return payload;
  },
};
