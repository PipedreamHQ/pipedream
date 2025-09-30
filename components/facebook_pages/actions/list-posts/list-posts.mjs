import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_pages-list-posts",
  name: "List Posts",
  description: "Retrieves a list of posts on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/page/feed)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.facebookPages,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.paginate({
      fn: this.facebookPages.listPosts,
      args: {
        pageId: this.page,
        $,
      },
    });

    const posts = [];
    let count = 0;
    for await (const post of response) {
      posts.push(post);

      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${posts.length} post${posts.length === 1
      ? ""
      : "s"}`);

    return posts;
  },
};
