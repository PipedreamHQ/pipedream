import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-text",
  name: "Upload Text",
  description: "Publish a text post to one or more social networks (X, LinkedIn, Facebook, Threads, Bluesky, Telegram, Discord and more). [See the documentation](https://docs.upload-post.com/api/upload-text)",
  version: "0.0.1",
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
      description: "Default text content of the post. Platform-specific texts (see **Additional Fields**) override it.",
    },
    linkUrl: {
      type: "string",
      label: "Link URL",
      description: "URL to show as a link preview card on the platforms that support it (LinkedIn, Bluesky, Facebook).",
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
      description: "Any other parameter documented for [Upload Text](https://docs.upload-post.com/api/upload-text), as `field: value` pairs (e.g. `x_title`, `linkedin_title`, `threads_long_text_as_post`, `poll_options` (JSON array), `reply_settings`).",
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
