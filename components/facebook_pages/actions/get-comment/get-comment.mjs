import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-get-comment",
  name: "Get Comment",
  description: "Retrieves a comment on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/comment/#read)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookPages,
        "post",
        (c) => ({
          pageId: c.page,
        }),
      ],
    },
    comment: {
      propDefinition: [
        common.props.facebookPages,
        "comment",
        (c) => ({
          pageId: c.page,
          postId: c.post,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.facebookPages.getComment({
      pageId: this.page,
      commentId: this.comment,
      $,
    });

    $.export("$summary", `Successfully retrieved comment with ID ${this.comment}`);

    return response;
  },
};
