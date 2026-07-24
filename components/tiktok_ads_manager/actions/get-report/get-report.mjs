import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-get-report",
  name: "Get Report",
  description:
    "Run a synchronous report to retrieve performance metrics for campaigns, ad groups, or ads."
    + " `report_type` is required. `advertiser_id` is required for BASIC, AUDIENCE, PLAYABLE_MATERIAL, CATALOG, and TT_SHOP reports; use `bc_id` for BC reports."
    + " `data_level` is required for BASIC, AUDIENCE, and CATALOG reports."
    + " `start_date` and `end_date` are required unless `query_lifetime` is true."
    + " `dimensions` must include an entity ID dimension for the chosen level (`campaign_id`, `adgroup_id`, or `ad_id`) plus a time dimension (`stat_time_day` or `stat_time_hour`)."
    + " Common metrics: `impressions`, `clicks`, `spend`, `cpc`, `cpm`, `ctr`, `reach`, `conversion`, `cost_per_conversion`."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/run-a-synchronous-report/v1.3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
      optional: true,
      description: "Required for BASIC, AUDIENCE, PLAYABLE_MATERIAL, CATALOG, and TT_SHOP reports. Not used for BC reports — use `bc_id` instead.",
    },
    bcId: {
      type: "string",
      label: "Business Center ID",
      description: "Required when `report_type` is `BC`. ID of the Business Center to report on. Use `/bc/get/` to find your Business Center IDs.",
      optional: true,
    },
    reportType: {
      type: "string",
      label: "Report Type",
      description: "`BASIC` is the standard performance report. `AUDIENCE` breaks down by audience attributes. `BC` reports on a Business Center (requires `bc_id`).",
      options: [
        "BASIC",
        "AUDIENCE",
        "PLAYABLE_MATERIAL",
        "CATALOG",
        "BC",
        "TT_SHOP",
      ],
      default: "BASIC",
    },
    dataLevel: {
      type: "string",
      label: "Data Level",
      description: "Granularity of the report. Required for BASIC, AUDIENCE, and CATALOG reports. `AUCTION_CAMPAIGN` = campaign level, `AUCTION_ADGROUP` = ad group level, `AUCTION_AD` = ad level, `AUCTION_ADVERTISER` = advertiser level.",
      optional: true,
      options: [
        "AUCTION_CAMPAIGN",
        "AUCTION_ADGROUP",
        "AUCTION_AD",
        "AUCTION_ADVERTISER",
      ],
    },
    dimensions: {
      type: "string[]",
      label: "Dimensions",
      description: "Required. Dimensions to group by. Include the entity ID for the chosen `data_level` (`campaign_id`, `adgroup_id`, or `ad_id`) plus a time dimension (`stat_time_day`). Example: `[\"campaign_id\", \"stat_time_day\"]`.",
      default: [
        "campaign_id",
        "stat_time_day",
      ],
    },
    metrics: {
      type: "string[]",
      label: "Metrics",
      description: "Metrics to return. Example: `[\"impressions\", \"clicks\", \"spend\", \"cpc\", \"ctr\"]`.",
      optional: true,
      default: [
        "spend",
        "impressions",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Report start date in `YYYY-MM-DD` format. Required unless `query_lifetime` is true. Max range is 30 days when `stat_time_day` is in dimensions, 365 days otherwise.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Report end date in `YYYY-MM-DD` format. Required unless `query_lifetime` is true.",
      optional: true,
    },
    queryLifetime: {
      type: "boolean",
      label: "Query Lifetime",
      description: "If true, returns lifetime metrics and ignores `start_date`/`end_date`. Only supported for BASIC and PLAYABLE_MATERIAL report types.",
      optional: true,
    },
    serviceType: {
      type: "string",
      label: "Service Type",
      description: "Ad service type. Not used for BC reports. Default is `AUCTION`.",
      optional: true,
      options: [
        "AUCTION",
      ],
    },
    filtering: {
      type: "string",
      label: "Filtering",
      description: "JSON array of filter objects, each with `field_name`, `filter_type`, and `filter_value`. Example: `[{\"field_name\":\"campaign_ids\",\"filter_type\":\"IN\",\"filter_value\":\"[\\\"123\\\"]\"}]`.",
      optional: true,
    },
    orderField: {
      type: "string",
      label: "Order Field",
      description: "Metric to sort results by. All supported metrics (excluding attribute metrics) can be used.",
      optional: true,
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "Sort direction. Default is `DESC`.",
      optional: true,
      options: [
        "DESC",
        "ASC",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page. Default: 10, max: 1000.",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const response = await this.app.getReport({
      $,
      params: {
        advertiser_id: this.advertiserId,
        bc_id: this.bcId,
        report_type: this.reportType,
        data_level: this.dataLevel,
        service_type: this.serviceType,
        dimensions: JSON.stringify(this.dimensions),
        metrics: JSON.stringify(this.metrics),
        start_date: this.startDate,
        end_date: this.endDate,
        query_lifetime: this.queryLifetime,
        filtering: this.filtering,
        order_field: this.orderField,
        order_type: this.orderType,
        page: this.page,
        page_size: this.pageSize,
      },
    });
    const list = response?.data?.list ?? [];
    $.export("$summary", `Report returned ${list.length} row(s)${this.startDate
      ? ` from ${this.startDate} to ${this.endDate}`
      : " (lifetime)"}`);
    return response;
  },
};
