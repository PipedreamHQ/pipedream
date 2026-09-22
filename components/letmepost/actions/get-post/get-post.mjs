import app from "../../letmepost.app.mjs";

export default {
  key: "letmepost-get-post",
  name: "Get a Post",
  description: "Retrieve a single post and its per-target results. [See the documentation](https://docs.letmepost.dev/api-reference/posts/fetch-a-single-post-with-its-publish-attempts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    postId: {
      propDefinition: [
        app,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getPost({
      $,
      postId: this.postId,
    });

    $.export("$summary", `Successfully retrieved post \`${this.postId}\``);

    return response;
  },
};
