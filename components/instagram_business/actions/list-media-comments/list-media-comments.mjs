import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-list-media-comments",
  name: "List Media Comments",
  description: "List comments on a media object. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-media/comments#reading)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    media: {
      propDefinition: [
        common.props.instagram,
        "media",
        (c) => ({
          pageId: c.page,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data: comments } = await this.instagram.listMediaComments({
      mediaId: this.media,
      params: {
        fields: "from, hidden, id, like_count, media, parent_id, replies, text, timestamp, user, username",
      },
      $,
    });

    if (comments?.length) {
      $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
        ? ""
        : "s"}`);
    }

    return comments;
  },
};
