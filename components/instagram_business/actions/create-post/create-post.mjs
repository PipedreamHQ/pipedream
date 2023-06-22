import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-create-post",
  name: "Create Post",
  description: "Post a single image, video, or reel. [See the documentation](https://developers.facebook.com/docs/instagram-api/guides/content-publishing#single-media-posts)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The type of media to post",
      options: [
        "image",
        "video",
        "reel",
      ],
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

    const data = {};
    if (this.mediaType === "image") {
      data.image_url = this.url;
    }
    if (this.mediaType === "video" || this.mediaType === "reel") {
      data.video_url = this.url;
    }
    if (this.mediaType === "reel") {
      data.media_type = "REEL";
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
