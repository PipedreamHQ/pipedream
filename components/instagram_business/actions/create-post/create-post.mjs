import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "instagram_business-create-post",
  name: "Create Post",
  description: "Post a single image, video, or reel. [See the documentation](https://developers.facebook.com/docs/instagram-api/guides/content-publishing#single-media-posts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The type of media to post",
      options: constants.MEDIA_TYPE_OPTIONS,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the media to post",
    },
  },
  async run({ $ }) {
    const accountId = await this.instagram.getInstagramBusinessAccountId({
      pageId: this.page,
      $,
    });

    const data = {
      media_type: this.mediaType,
    };
    if (this.mediaType === "IMAGE") {
      data.image_url = this.url;
    }
    if (this.mediaType === "VIDEO" || this.mediaType === "REELS") {
      data.video_url = this.url;
    }

    const { id } = await this.instagram.createContainer({
      accountId,
      data,
      $,
    });

    const post = await this.instagram.publishContainer({
      accountId,
      data: {
        creation_id: id,
      },
      $,
    });

    return post;
  },
};
