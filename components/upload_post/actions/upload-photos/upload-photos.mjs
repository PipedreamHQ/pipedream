import common from "../../common/upload-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "upload_post-upload-photos",
  name: "Upload Photos",
  description: "Publish one or more photos from public URLs (a carousel when several) to one or more social networks, now, at a scheduled date or in the profile's queue."
    + " Use **List Profiles** to find the profile, **List Facebook Pages** / **List Pinterest Boards** / **List LinkedIn Pages** for page and board IDs."
    + " Returns a `request_id` (follow it with **Get Upload Status**) or, when scheduled, a `job_id`."
    + " Use **Upload Video** for single videos. [See the documentation](https://docs.upload-post.com/api/upload-photo)",
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
          supportedPlatforms: constants.PHOTO_PLATFORMS,
        }),
      ],
    },
    photos: {
      type: "string[]",
      label: "Photo URLs",
      description: "Public, direct URLs of the photos to publish, e.g. `[\"https://example.com/1.jpg\", \"https://example.com/2.jpg\"]`. Instagram and Threads also accept video URLs here for mixed carousels.",
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
      propDefinition: [
        common.props.app,
        "privacyLevel",
      ],
      description: "TikTok privacy setting, e.g. `SELF_ONLY`. Defaults to `PUBLIC_TO_EVERYONE`. TikTok decides per account which levels are available.",
    },
    autoAddMusic: {
      type: "boolean",
      label: "TikTok Auto Add Music",
      description: "Set to `true` to let TikTok add background music to the photo post, e.g. `true`.",
      optional: true,
      default: false,
    },
    mediaType: {
      type: "string",
      label: "Instagram Media Type",
      description: "Type of Instagram photo media, e.g. `STORIES`. Defaults to `IMAGE` (a carousel when several photos).",
      options: [
        "IMAGE",
        "STORIES",
      ],
      optional: true,
    },
    facebookMediaType: {
      type: "string",
      label: "Facebook Media Type",
      description: "Type of Facebook photo media, e.g. `STORIES`. Defaults to `POSTS`.",
      options: [
        "POSTS",
        "STORIES",
      ],
      optional: true,
    },
    visibility: {
      propDefinition: [
        common.props.app,
        "visibility",
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
      description: "Any other parameter documented for [Upload Photos](https://docs.upload-post.com/api/upload-photo) as `field: value` pairs, e.g. `{\"instagram_title\": \"Carousel\", \"tiktok_description\": \"Swipe\", \"photo_cover_index\": 1, \"pinterest_link\": \"https://example.com\"}`.",
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
