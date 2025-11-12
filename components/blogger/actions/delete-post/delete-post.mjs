import bloggerApp from "../../blogger.app.mjs";

export default {
  name: "Delete a Post",
  description: "Permanently removes a post (the deleted post cannot be restored anymore) [See the docs here](https://developers.google.com/blogger/docs/3.0/reference/posts/delete).",
  key: "blogger-delete-post",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      blog,
      post,
    } = this;

    await this.bloggerApp.deletePost(
      $,
      blog,
      post,
    );

    $.export("$summary", "Post successfully deleted.");
  },
};
