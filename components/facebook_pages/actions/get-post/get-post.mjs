import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-get-post",
  name: "Get Post",
  description: "Retrieves a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/pagepost)",
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
  },
  async run({ $ }) {
    const response = await this.facebookPages.getPost({
      pageId: this.page,
      postId: this.post,
      $,
    });

    $.export("$summary", `Successfully retrieved post with ID ${this.post}`);

    return response;
  },
};
