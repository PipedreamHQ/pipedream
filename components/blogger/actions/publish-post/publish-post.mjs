import bloggerApp from "../../blogger.app.mjs";

export default {
  name: "Publish a Post",
  description: "Publishes a draft post [See the docs here](https://developers.google.com/blogger/docs/3.0/reference/posts/publish).",
  key: "blogger-publish-post",
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
          status: "draft",
        }),
      ],
    },
    publishDate: {
      type: "string",
      label: "Publish Date",
      description: "The date and time to schedule the publishing of the Post. Date must follow [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format. Ex: `2019-10-12T07:20:50.52Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      blog,
      post,
      publishDate,
    } = this;

    const res = await this.bloggerApp.publishPost(
      $,
      blog,
      post,
      publishDate,
    );

    $.export("$summary", "Post successfully published.");

    return res;
  },
};
