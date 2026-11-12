import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-text",
  name: "Upload Text",
  description: "Publish a text post to one or more social networks (X, LinkedIn, Facebook, Threads, Bluesky, Telegram, Discord and more), now, at a scheduled date or in the profile's queue."
    + " Use **List Profiles** to find the profile and **List Facebook Pages** / **List LinkedIn Pages** for page IDs."
    + " Returns a `request_id` (follow it with **Get Upload Status**) or, when scheduled, a `job_id`."
    + " Instagram, TikTok and YouTube do not accept text-only posts. [See the documentation](https://docs.upload-post.com/api/upload-text)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    platforms: {
      propDefinition: [
        common.props.app,
        "platforms",
        (c) => ({
          user: c.user,
          supportedPlatforms: constants.TEXT_PLATFORMS,
        }),
      ],
    },
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
      label: "Text",
      description: "Default text content of the post, e.g. `We just shipped dark mode!`. Platform-specific texts passed in `additionalFields` (e.g. `x_title`) override it.",
    },
    linkUrl: {
      type: "string",
      label: "Link URL",
      description: "URL shown as a link preview card on the platforms that support it (LinkedIn, Bluesky, Facebook), e.g. `https://example.com/blog/dark-mode`.",
      optional: true,
    },
    scheduledDate: {
      propDefinition: [
        common.props.app,
        "scheduledDate",
      ],
    },
    timezone: {
      propDefinition: [
        common.props.app,
        "timezone",
      ],
    },
    addToQueue: {
      propDefinition: [
        common.props.app,
        "addToQueue",
      ],
    },
    asyncUpload: {
      propDefinition: [
        common.props.app,
        "asyncUpload",
      ],
    },
    firstComment: {
      propDefinition: [
        common.props.app,
        "firstComment",
      ],
    },
    externalId: {
      propDefinition: [
        common.props.app,
        "externalId",
      ],
    },
    facebookPageId: {
      propDefinition: [
        common.props.app,
        "facebookPageId",
        (c) => ({
          user: c.user,
        }),
      ],
    },
    targetLinkedinPageId: {
      propDefinition: [
        common.props.app,
        "targetLinkedinPageId",
        (c) => ({
          user: c.user,
        }),
      ],
    },
    additionalFields: {
      propDefinition: [
        common.props.app,
        "additionalFields",
      ],
      description: "Any other parameter documented for [Upload Text](https://docs.upload-post.com/api/upload-text) as `field: value` pairs, e.g. `{\"x_title\": \"Short version\", \"threads_long_text_as_post\": true, \"poll_options\": [\"Yes\", \"No\"], \"poll_duration\": 1440}`. Array parameters take a JSON array.",
    },
  },
  async run({ $ }) {
    const response = await this.app.uploadText({
      $,
      fields: this.buildFields({
        "link_url": this.linkUrl,
        "facebook_page_id": this.facebookPageId,
        "target_linkedin_page_id": this.targetLinkedinPageId,
      }),
    });
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
