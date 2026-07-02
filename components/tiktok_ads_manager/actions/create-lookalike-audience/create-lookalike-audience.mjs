import app from "../../tiktok_ads_manager.app.mjs";

export default {
  key: "tiktok_ads_manager-create-lookalike-audience",
  name: "Create Lookalike Audience",
  description:
    "Create a TikTok lookalike audience based on an existing custom audience."
    + " TikTok finds users who share characteristics with the source audience."
    + " Use **List Audiences** to find the source audience ID."
    + " `audience_size` controls reach vs accuracy: `NARROW` = most similar (smallest), `BALANCED` = mixed, `BROAD` = largest reach."
    + " Location IDs: `6252001` = United States, `6269131` = United Kingdom."
    + " Newly created audiences require up to 48 hours to be analyzed before they become active."
    + " [See the documentation](https://business-api.tiktok.com/portal/docs/create-a-lookalike-audience/v1.3)",
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
    audienceName: {
      type: "string",
      label: "Audience Name",
      description: "Display name for the new lookalike audience. Maximum 128 characters.",
    },
    sourceAudienceId: {
      type: "string",
      label: "Source Audience ID",
      description: "ID of the custom audience to base the lookalike on. Cannot be an existing lookalike audience. Source audience must have at least 100 members. Use **List Audiences** to find the ID.",
    },
    audienceSize: {
      type: "string",
      label: "Audience Size",
      description: "Reach vs similarity tradeoff. `NARROW` = closest match (smallest audience). `BALANCED` = mixed. `BROAD` = largest reach (least similar).",
      options: [
        "NARROW",
        "BALANCED",
        "BROAD",
      ],
    },
    locationIds: {
      type: "string[]",
      label: "Location IDs",
      description: "Target geographic locations by TikTok location ID. Example: `6252001` = United States, `6269131` = United Kingdom.",
    },
    includeSource: {
      type: "boolean",
      label: "Include Source Audience",
      description: "Whether to include the source audience members in the new lookalike audience.",
      default: false,
    },
    mobileOs: {
      type: "string",
      label: "Mobile OS",
      description: "Device operating systems to target. `ALL` targets both Android and iOS.",
      options: [
        "ALL",
        "ANDROID",
        "IOS",
      ],
      default: "ALL",
    },
    placements: {
      type: "string[]",
      label: "Placements",
      description: "Apps where the audience can be used. `TikTok` is the standard placement.",
      options: [
        "TikTok",
        "TopBuzz & BuzzVideo",
        "Pangle",
      ],
      default: [
        "TikTok",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createLookalikeAudience({
      $,
      data: {
        advertiser_id: this.advertiserId,
        custom_audience_name: this.audienceName,
        lookalike_spec: {
          source_audience_id: this.sourceAudienceId,
          audience_size: this.audienceSize,
          location_ids: this.locationIds,
          include_source: this.includeSource,
          mobile_os: this.mobileOs,
          placements: this.placements,
        },
      },
    });

    const audienceId = response?.data?.custom_audience_id;
    $.export("$summary", `Created lookalike audience "${this.audienceName}"${audienceId
      ? ` (ID: ${audienceId})`
      : ""}`);
    return response;
  },
};
