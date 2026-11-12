import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "upload_post-get-analytics",
  name: "Get Analytics",
  description: "Get profile-level analytics (followers, impressions, reach and more) of a profile's connected accounts on one or more platforms."
    + " Use **List Profiles** to find the profile, **List Facebook Pages** for `pageId` (required for Facebook) and **List LinkedIn Pages** for `pageUrn`."
    + " LinkedIn analytics are only available for organization pages, not personal profiles. [See the documentation](https://docs.upload-post.com/api/get-analytics)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    profileUsername: {
      propDefinition: [
        app,
        "user",
      ],
    },
    platforms: {
      propDefinition: [
        app,
        "platforms",
        (c) => ({
          user: c.profileUsername,
          supportedPlatforms: constants.ANALYTICS_PLATFORMS,
        }),
      ],
      description: "The platform(s) to fetch analytics for, e.g. `[\"instagram\", \"youtube\"]`. Use **List Profiles** to see a profile's connected accounts (the keys of `social_accounts`).",
    },
    pageId: {
      propDefinition: [
        app,
        "facebookPageId",
        (c) => ({
          user: c.profileUsername,
        }),
      ],
      description: "ID of the Facebook Page to fetch analytics for, e.g. `109876543210987`. Required for Facebook analytics. Use **List Facebook Pages** to find it (the `id` field).",
    },
    days: {
      type: "integer",
      label: "Days",
      description: "Facebook only. Size of the insights window in days, `1`-`365`, e.g. `90`. Defaults to `30`.",
      min: 1,
      max: 365,
      optional: true,
    },
    pageUrn: {
      propDefinition: [
        app,
        "targetLinkedinPageId",
        (c) => ({
          user: c.profileUsername,
        }),
      ],
      description: "LinkedIn only. Organization page to fetch analytics for, e.g. `urn:li:organization:12345678`. Use **List LinkedIn Pages** to find it (the `id` field). Defaults to the first page you administer.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getAnalytics({
      $,
      profileUsername: this.profileUsername,
      params: {
        platforms: this.platforms.join(","),
        page_id: this.pageId,
        days: this.days,
        page_urn: this.pageUrn,
      },
    });
    $.export("$summary", `Successfully retrieved analytics for profile \`${this.profileUsername}\``);
    return response;
  },
};
