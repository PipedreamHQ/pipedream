import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-list-ad-groups",
  name: "List Ad Groups",
  description:
    "List ad groups in a TikTok Ads account with optional filters."
    + " Returns ad group IDs, names, status, budget, schedule, and targeting."
    + " Use campaign IDs from **List Campaigns** to filter. Use ad group IDs returned here as input to **List Ads** or **Create or Update Ad**."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/get-ad-groups/v1.3)",
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
    },
    campaignIds: {
      type: "string[]",
      label: "Campaign IDs",
      description: "Filter by campaign IDs (max 100). Use **List Campaigns** to find IDs.",
      optional: true,
    },
    adgroupIds: {
      type: "string[]",
      label: "Ad Group IDs",
      description: "Filter by specific ad group IDs (max 100).",
      optional: true,
    },
    adgroupName: {
      type: "string",
      label: "Ad Group Name",
      description: "Filter by ad group name.",
      optional: true,
    },
    primaryStatus: {
      propDefinition: [
        app,
        "primaryStatus",
      ],
      description: "Filter by primary status. Default is `STATUS_NOT_DELETE` (all except deleted). Use `STATUS_ALL` to include deleted ad groups.",
    },
    secondaryStatus: {
      type: "string",
      label: "Secondary Status",
      description: "Filter by ad group secondary status. Example values: `ADGROUP_STATUS_DELIVERY_OK`, `ADGROUP_STATUS_CAMPAIGN_DISABLE`, `ADGROUP_STATUS_DELETE`.",
      optional: true,
    },
    objectiveType: {
      type: "string",
      label: "Objective Type",
      description: "Filter by advertising objective. Example values: `REACH`, `TRAFFIC`, `VIDEO_VIEWS`, `CONVERSIONS`, `APP_PROMOTION`.",
      optional: true,
    },
    billingEvents: {
      type: "string[]",
      label: "Billing Events",
      description: "Filter by billing event types. Example values: `CPC`, `CPM`, `OCPM`, `CPV`.",
      optional: true,
    },
    creationFilterStartTime: {
      type: "string",
      label: "Created After",
      description: "Return ad groups created after this time. Format: `YYYY-MM-DD HH:MM:SS` (UTC). A range within 6 months is recommended.",
      optional: true,
    },
    creationFilterEndTime: {
      type: "string",
      label: "Created Before",
      description: "Return ad groups created before this time. Format: `YYYY-MM-DD HH:MM:SS` (UTC). A range within 6 months is recommended.",
      optional: true,
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
    const filtering = JSON.stringify({
      campaign_ids: this.campaignIds?.length
        ? this.campaignIds
        : undefined,
      adgroup_ids: this.adgroupIds?.length
        ? this.adgroupIds
        : undefined,
      adgroup_name: this.adgroupName || undefined,
      primary_status: this.primaryStatus || undefined,
      secondary_status: this.secondaryStatus || undefined,
      objective_type: this.objectiveType || undefined,
      billing_events: this.billingEvents?.length
        ? this.billingEvents
        : undefined,
      creation_filter_start_time: this.creationFilterStartTime || undefined,
      creation_filter_end_time: this.creationFilterEndTime || undefined,
    });

    const response = await this.app.listAdGroups({
      $,
      params: {
        advertiser_id: this.advertiserId,
        filtering: filtering === "{}"
          ? undefined
          : filtering,
        page: this.page,
        page_size: this.pageSize,
      },
    });
    const list = response?.data?.list ?? [];
    $.export("$summary", `Found ${list.length} ad group(s) for advertiser ${this.advertiserId}`);
    return response;
  },
};
