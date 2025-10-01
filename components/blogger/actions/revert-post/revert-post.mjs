import bloggerApp from "../../blogger.app.mjs";

export default {
  name: "Revert a Post",
  description: "Revert a published or scheduled post to draft state.[See the docs here](https://developers.google.com/blogger/docs/3.0/reference/posts/revert).",
  key: "blogger-revert-post",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bloggerApp,
    blog: {
      propDefinition: [
        bloggerApp,
        "blog",
      ],
    },
    post: {
      propDefinition: [
        bloggerApp,
        "post",
        ({ blog }) => ({
          blog,
          status: [
            "live",
            "scheduled",
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      blog,
      post,
    } = this;

    const res = await this.bloggerApp.revertPost(
      $,
      blog,
      post,
    );

    $.export("$summary", "Post successfully reverted.");

    return res;
  },
};
