import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-photos",
  name: "Upload Photos",
  description: "Publish one or more photos (a carousel when several) from public URLs to one or more social networks. [See the documentation](https://docs.upload-post.com/api/upload-photo)",
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
          supportedPlatforms: constants.PHOTO_PLATFORMS,
        }),
      ],
    },
    photos: {
      type: "string[]",
      label: "Photo URLs",
      description: "Public, direct URLs of the photos to publish. Instagram and Threads also accept videos here for mixed carousels.",
    },
    title: {
      propDefinition: [
        common.props.app,
        "title",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        common.props.app,
        "description",
      ],
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
    privacyLevel: {
      type: "string",
      label: "TikTok Privacy Level",
      description: "TikTok privacy setting. Defaults to `PUBLIC_TO_EVERYONE`. TikTok decides per account which levels are available.",
      options: constants.TIKTOK_PRIVACY_LEVELS,
      optional: true,
    },
    autoAddMusic: {
      type: "boolean",
      label: "TikTok Auto Add Music",
      description: "Automatically add background music to TikTok photo posts.",
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Instagram Media Type",
      description: "Type of Instagram photo media. Defaults to `IMAGE` (carousel when several photos).",
      options: [
        "IMAGE",
        "STORIES",
      ],
      optional: true,
    },
    facebookMediaType: {
      type: "string",
      label: "Facebook Media Type",
      description: "Type of Facebook photo media. Defaults to `POSTS`.",
      options: [
        "POSTS",
        "STORIES",
      ],
      optional: true,
    },
    visibility: {
      type: "string",
      label: "LinkedIn Visibility",
      description: "LinkedIn visibility setting. Defaults to `PUBLIC`.",
      options: constants.LINKEDIN_VISIBILITY,
      optional: true,
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
    pinterestBoardId: {
      propDefinition: [
        common.props.app,
        "pinterestBoardId",
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
      description: "Any other parameter documented for [Upload Photos](https://docs.upload-post.com/api/upload-photo), as `field: value` pairs (e.g. `instagram_title`, `tiktok_description`, `photo_cover_index`, `pinterest_link`, `x_first_comment`).",
    },
  },
  async run({ $ }) {
    const response = await this.app.uploadPhotos({
      $,
      fields: this.buildFields({
        "photos[]": this.photos,
        "privacy_level": this.privacyLevel,
        "auto_add_music": this.autoAddMusic,
        "media_type": this.mediaType,
        "facebook_media_type": this.facebookMediaType,
        "visibility": this.visibility,
        "facebook_page_id": this.facebookPageId,
        "target_linkedin_page_id": this.targetLinkedinPageId,
        "pinterest_board_id": this.pinterestBoardId,
      }),
    });
    $.export("$summary", this.getSummary(response));
    return response;
  },
};
