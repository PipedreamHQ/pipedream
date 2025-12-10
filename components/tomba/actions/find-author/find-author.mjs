import app from "../../tomba.app.mjs";

export default {
  key: "tomba-find-author",
  name: "Find Author",
  description:
    "Generate or retrieve the most likely email address from a blog post URL. [See the documentation](https://docs.tomba.io/api/finder#author-finder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    blogUrl: {
      propDefinition: [
        app,
        "blogUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.findAuthor({
      $,
      blogUrl: this.blogUrl,
    });

    $.export(
      "$summary",
      `Successfully found author information for blog post: ${this.blogUrl}`,
    );
    return response;
  },
};
