import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-manage-spark-ad",
  name: "Get Spark Ad Video Info",
  description:
    "Get information about one or more TikTok posts published via a linked identity, for use as Spark Ad creatives."
    + " Returns video duration, dimensions, cover image, authorization status, and visibility."
    + " Requires an identity (`identity_type` + `identity_id`) — use `/identity/get/` to find identities linked to your ad account."
    + " Pass either `item_id` (single post) or `item_ids` (up to 20 posts)."
    + " Pass the returned `item_id` to **Create or Update Ad** as `tiktok_item_id` to create a Spark Ad."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/get-info-about-tiktok-posts/v1.3)",
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
    identityType: {
      type: "string",
      label: "Identity Type",
      description: "The type of identity that published the TikTok post. `AUTH_CODE` = Authorized Post User. `TT_USER` = TikTok Business Account User. `BC_AUTH_TT` = TikTok account authorized via Business Center.",
      options: [
        "AUTH_CODE",
        "TT_USER",
        "BC_AUTH_TT",
      ],
    },
    identityId: {
      type: "string",
      label: "Identity ID",
      description: "The ID of the identity. Use `/identity/get/` to retrieve identities linked to your ad account.",
    },
    identityAuthorizedBcId: {
      type: "string",
      label: "Identity Authorized BC ID",
      description: "Required when `identity_type` is `BC_AUTH_TT`. ID of the Business Center associated with the TikTok account.",
      optional: true,
    },
    itemId: {
      type: "string",
      label: "Post ID",
      description: "ID of a single TikTok post to look up. Use either this or `item_ids` (not both). Use `/identity/video/get/` to find post IDs for an identity.",
      optional: true,
    },
    itemIds: {
      type: "string[]",
      label: "Post IDs",
      description: "IDs of multiple TikTok posts to look up (max 20). Use either this or `item_id` (not both).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getSparkAdVideoInfo({
      $,
      params: {
        advertiser_id: this.advertiserId,
        identity_type: this.identityType,
        identity_id: this.identityId,
        identity_authorized_bc_id: this.identityAuthorizedBcId,
        item_id: this.itemId,
        item_ids: this.itemIds?.length
          ? JSON.stringify(this.itemIds)
          : undefined,
      },
    });

    const count = response?.data?.video_details?.length
      ?? (response?.data?.video_detail
        ? 1
        : 0);
    $.export("$summary", `Retrieved info for ${count} TikTok post(s)`);
    return response;
  },
};
