import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-update-post",
  name: "Update Post",
  description: "Update an existing post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/post#updating)",
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
    message: {
      type: "string",
      label: "Message",
      description: "The main body of the post, otherwise called the status message.",
    },
  },
  async run({ $ }) {
    const response = await this.facebookPages.updatePost({
      pageId: this.page,
      postId: this.post,
      data: {
        message: this.message,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated post with ID ${this.post}.`);
    }

    return response;
  },
};
