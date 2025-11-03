import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-list-comments",
  name: "List Comments",
  description: "Retrieves a list of comments on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/comment/#read)",
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
    maxResults: {
      propDefinition: [
        common.props.facebookPages,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.paginate({
      fn: this.facebookPages.listComments,
      args: {
        pageId: this.page,
        postId: this.post,
        $,
      },
    });

    const comments = [];
    let count = 0;
    for await (const comment of response) {
      comments.push(comment);

      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
      ? ""
      : "s"}`);

    return comments;
  },
};
