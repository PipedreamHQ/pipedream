import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-create-comment",
  name: "Create Comment",
  description: "Create a new comment on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/object/comments/#publish)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    message: {
      type: "string",
      label: "Message",
      description: "The comment text",
    },
  },
  async run({ $ }) {
    const response = await this.facebookPages.createComment({
      pageId: this.page,
      postId: this.post,
      data: {
        message: this.message,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created new comment with ID ${response.id}.`);
    }

    return response;
  },
};
