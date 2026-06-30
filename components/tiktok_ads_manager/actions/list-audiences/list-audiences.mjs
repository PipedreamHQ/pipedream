import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-list-audiences",
  name: "List Audiences",
  description:
    "List custom audiences in a TikTok Ads account."
    + " Returns audience IDs, names, types, coverage, validity, and expiry."
    + " Returns both owned and shared audiences — use `is_creator` in the response to check ownership."
    + " Use audience IDs returned here as input to **Update Audience** or **Create Lookalike Audience**."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/get-all-audiences/v1.3)",
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
    customAudienceIds: {
      type: "string[]",
      label: "Audience IDs",
      description: "Filter by specific audience IDs (max 100). Leave blank to return all audiences.",
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
      description: "Number of results per page. Default: 10, max: 100.",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const response = await this.app.listAudiences({
      $,
      params: {
        advertiser_id: this.advertiserId,
        custom_audience_ids: this.customAudienceIds?.length
          ? JSON.stringify(this.customAudienceIds)
          : undefined,
        page: this.page,
        page_size: this.pageSize,
      },
    });
    const list = response?.data?.list ?? [];
    $.export("$summary", `Found ${list.length} custom audience(s) for advertiser ${this.advertiserId}`);
    return response;
  },
};
