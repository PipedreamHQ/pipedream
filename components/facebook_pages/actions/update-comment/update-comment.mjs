import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-update-comment",
  name: "Update Comment",
  description: "Updates an existing comment on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/comment/#updating)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    message: {
      type: "string",
      label: "Message",
      description: "The comment text",
    },
  },
  async run({ $ }) {
    const response = await this.facebookPages.updateComment({
      pageId: this.page,
      commentId: this.comment,
      data: {
        message: this.message,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated comment with ID ${this.comment}.`);
    }

    return response;
  },
};
