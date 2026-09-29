import app from "../../upload_post.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "upload_post-get-analytics",
  name: "Get Analytics",
  description: "Get profile-level analytics (followers, impressions, reach and more) of a profile's connected accounts. [See the documentation](https://docs.upload-post.com/api/get-analytics)",
  version: "0.0.1",
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
      description: "The platform(s) to fetch analytics for",
    },
    pageId: {
      propDefinition: [
        app,
        "facebookPageId",
        (c) => ({
          user: c.profileUsername,
        }),
      ],
      description: "The Facebook Page to fetch analytics for. Required for Facebook analytics.",
    },
    days: {
      type: "integer",
      label: "Days",
      description: "**Facebook only.** Size of the insights window in days, `1`-`365`. Defaults to `30`.",
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
      description: "**LinkedIn only.** The organization page to fetch analytics for. Personal LinkedIn profiles are not supported. Defaults to the first page you administer.",
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
