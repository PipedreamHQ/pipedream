import bloggerApp from "../../blogger.app.mjs";

export default {
  name: "Create a Post",
  description: "Creates and publishes a new post or creates a new post as a draft. [See the docs here](https://developers.google.com/blogger/docs/3.0/reference/posts/insert).",
  key: "blogger-create-post",
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
    title: {
      propDefinition: [
        bloggerApp,
        "title",
      ],
    },
    content: {
      propDefinition: [
        bloggerApp,
        "content",
      ],
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "If `true` your post will be created as `draft`, otherwise, it will be automatically published (as `live`).",
    },
  },
  async run({ $ }) {
    const dataParams = {
      content: this.content,
      title: this.title,
    };
    const urlParams = {
      isDraft: this.isDraft,
    };
    const res = await this.bloggerApp.newPost(
      $,
      this.blog,
      dataParams,
      urlParams,
    );

    $.export("$summary", "Post successfully created.");

    return res;
  },
};
