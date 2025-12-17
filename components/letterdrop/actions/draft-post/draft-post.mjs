import app from "../../letterdrop.app.mjs";

export default {
  key: "letterdrop-draft-post",
  name: "Draft Blog Post",
  description: "Drafts a new blog post in your workspace with the required title and content, and optional images and tags. [See the documentation](https://docs.letterdrop.com/api#draft-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the blog post",
    },
    subtitle: {
      type: "string",
      label: "Subtitle",
      description: "The subtitle of the blog post",
      optional: true,
    },
    html: {
      type: "string",
      label: "Content",
      description: "The HTML content of the blog post",
    },
  },
  methods: {
    draftPost(args = {}) {
      return this.app.post({
        path: "/post/draft",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      draftPost,
      title,
      subtitle,
      html,
    } = this;

    const response = await draftPost({
      $,
      data: {
        title,
        subtitle,
        html,
      },
    });

    $.export("$summary", `Successfully drafted the post with link \`${response.draftLink}\``);
    return response;
  },
};
