import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-create-or-update-ad",
  name: "Create or Update Ad",
  description:
    "Create a new TikTok ad or update an existing one."
    + " Omit `ad_id` to create; provide it to update."
    + " Creative assets must be uploaded first using **Upload Creative** — the API requires asset IDs, not file URLs."
    + " `identity_type` and `identity_id` are required in v1.3; use `CUSTOMIZED_USER` for non-Spark Ads."
    + " For create, see [documentation](https://business-api.tiktok.com/portal/docs/create-ads/v1.3)."
    + " For update, see [documentation](https://business-api.tiktok.com/portal/docs/update-ads/v1.3).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    advertiserId: {
      propDefinition: [
        app,
        "advertiserId",
      ],
    },
    adId: {
      type: "string",
      label: "Ad ID",
      description: "ID of an existing ad to update. Omit to create a new ad. Use **List Ads** to find existing IDs.",
      optional: true,
    },
    adgroupId: {
      type: "string",
      label: "Ad Group ID",
      description: "Ad group to place this ad in. Required for create and update. Use **List Ad Groups** to find IDs.",
    },
    adName: {
      type: "string",
      label: "Ad Name",
      description: "Internal name for the ad. Maximum 512 characters.",
    },
    identityType: {
      type: "string",
      label: "Identity Type",
      description: "Required in v1.3. Use `CUSTOMIZED_USER` for standard (non-Spark) ads. `AUTH_CODE` or `BC_AUTH_TT` for Spark Ads. See TikTok Identities documentation for details.",
      optional: true,
      options: [
        "CUSTOMIZED_USER",
        "AUTH_CODE",
        "TT_USER",
        "BC_AUTH_TT",
      ],
    },
    identityId: {
      type: "string",
      label: "Identity ID",
      description: "Required in v1.3. The ID of the identity corresponding to `identity_type`.",
      optional: true,
    },
    adFormat: {
      type: "string",
      label: "Ad Format",
      description: "`SINGLE_VIDEO` requires `video_id`. `SINGLE_IMAGE` requires `image_ids`. `CAROUSEL_ADS` for standard carousel.",
      optional: true,
      options: [
        "SINGLE_VIDEO",
        "SINGLE_IMAGE",
        "CAROUSEL_ADS",
        "CATALOG_CAROUSEL",
        "LIVE_CONTENT",
      ],
    },
    imageIds: {
      type: "string[]",
      label: "Image IDs",
      description: "Asset IDs of uploaded images from **Upload Creative**. Required for `SINGLE_IMAGE`. Also used as video cover/thumbnail for `SINGLE_VIDEO` (one ID only).",
      optional: true,
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "Asset ID of an uploaded video from **Upload Creative**. Required for `SINGLE_VIDEO` when `identity_type` is `CUSTOMIZED_USER`.",
      optional: true,
    },
    adText: {
      type: "string",
      label: "Ad Text",
      description: "Main ad copy shown to the audience. Maximum 100 characters, no emoji.",
      optional: true,
    },
    callToAction: {
      type: "string",
      label: "Call to Action",
      description: "CTA button label. Example values: `LEARN_MORE`, `SHOP_NOW`, `SIGN_UP`, `DOWNLOAD_NOW`, `CONTACT_US`, `APPLY_NOW`, `BOOK_NOW`.",
      optional: true,
    },
    landingPageUrl: {
      type: "string",
      label: "Landing Page URL",
      description: "URL users are redirected to when they click the ad.",
      optional: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Brand or business name shown on the ad. Required when promotion type is landing page or pure exposure. 1-40 English characters.",
      optional: true,
    },
    operationStatus: {
      propDefinition: [
        app,
        "operationStatus",
      ],
    },
  },
  async run({ $ }) {
    const isUpdate = !!this.adId;

    const creative = {
      ad_name: this.adName,
      identity_type: this.identityType,
      identity_id: this.identityId,
      ad_format: this.adFormat,
      image_ids: this.imageIds,
      video_id: this.videoId,
      ad_text: this.adText,
      call_to_action: this.callToAction,
      landing_page_url: this.landingPageUrl,
      display_name: this.displayName,
      operation_status: this.operationStatus,
    };

    if (isUpdate) {
      creative.ad_id = this.adId;
    }

    const data = {
      advertiser_id: this.advertiserId,
      adgroup_id: this.adgroupId,
      creatives: [
        creative,
      ],
    };

    const response = await (isUpdate
      ? this.app.updateAd({
        $,
        data,
      })
      : this.app.createAd({
        $,
        data,
      }));

    const adId = response?.data?.ad_ids?.[0];
    const action = isUpdate
      ? "Updated"
      : "Created";
    $.export("$summary", `${action} ad${adId
      ? ` ${adId}`
      : ""}${this.adName
      ? `: ${this.adName}`
      : ""}`);
    return response;
  },
};
