import bloggerApp from "../../blogger.app.mjs";

export default {
  name: "Update a Post",
  description: "Updates a published post. [See the docs here](https://developers.google.com/blogger/docs/3.0/reference/posts/update).",
  key: "blogger-update-post",
  version: "0.0.1",
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
    title: {
      propDefinition: [
        bloggerApp,
        "title",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        bloggerApp,
        "content",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      blog,
      post,
      title,
      content,
    } = this;

    let postData;
    if (!content || !title) {
      postData = await this.bloggerApp.getBlogPost($, blog, post);
    }

    const dataParams = {
      content: content || postData.content,
      title: title || postData.title,
    };

    const res = await this.bloggerApp.updatePost(
      $,
      this.blog,
      this.post,
      dataParams,
    );

    $.export("$summary", "Post successfully updated.");

    return res;
  },
};
