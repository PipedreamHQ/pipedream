import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-list-ads",
  name: "List Ads",
  description:
    "List ads in a TikTok Ads account with optional filters."
    + " Returns ad IDs, names, status, and creative details."
    + " Use campaign or ad group IDs from **List Campaigns** / **List Ad Groups** to narrow results."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/get-ads/v1.3)",
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
      description: "Filter by ad group IDs (max 100). Use **List Ad Groups** to find IDs.",
      optional: true,
    },
    adIds: {
      type: "string[]",
      label: "Ad IDs",
      description: "Filter by specific ad IDs (max 100).",
      optional: true,
    },
    primaryStatus: {
      propDefinition: [
        app,
        "primaryStatus",
      ],
      description: "Filter by primary status. Default is `STATUS_NOT_DELETE` (all except deleted). Use `STATUS_ALL` to include deleted ads.",
    },
    secondaryStatus: {
      type: "string",
      label: "Secondary Status",
      description: "Filter by ad secondary status. Example values: `AD_STATUS_DELIVERY_OK`, `AD_STATUS_ADGROUP_DELETE`, `AD_STATUS_DELETE`.",
      optional: true,
    },
    objectiveType: {
      type: "string",
      label: "Objective Type",
      description: "Filter by advertising objective. Example values: `REACH`, `TRAFFIC`, `VIDEO_VIEWS`, `CONVERSIONS`, `APP_PROMOTION`.",
      optional: true,
    },
    creationFilterStartTime: {
      type: "string",
      label: "Created After",
      description: "Return ads created after this time. Format: `YYYY-MM-DD HH:MM:SS` (UTC). A range within 6 months is recommended.",
      optional: true,
    },
    creationFilterEndTime: {
      type: "string",
      label: "Created Before",
      description: "Return ads created before this time. Format: `YYYY-MM-DD HH:MM:SS` (UTC). A range within 6 months is recommended.",
      optional: true,
    },
    modifiedAfter: {
      type: "string",
      label: "Modified After",
      description: "Return ads modified after this time. Format: `YYYY-MM-DD HH:MM:SS` (UTC). A range within 6 months is recommended.",
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
      ad_ids: this.adIds?.length
        ? this.adIds
        : undefined,
      primary_status: this.primaryStatus || undefined,
      secondary_status: this.secondaryStatus || undefined,
      objective_type: this.objectiveType || undefined,
      creation_filter_start_time: this.creationFilterStartTime || undefined,
      creation_filter_end_time: this.creationFilterEndTime || undefined,
      modified_after: this.modifiedAfter || undefined,
    });

    const response = await this.app.listAds({
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
    $.export("$summary", `Found ${list.length} ad(s) for advertiser ${this.advertiserId}`);
    return response;
  },
};
