import app from "../../supabird.app.mjs";

export default {
  key: "supabird-get-post",
  name: "Get Post",
  description: "Get one post with its status, schedule and the public URL on every network once it is published. Use **Create Post** or the **New Scheduled Post** source to get a post ID. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
    const urlCount = response.published_urls?.length ?? 0;
    $.export(
      "$summary",
      `Retrieved post ${response.id} (${response.status}, ${urlCount} published URL${urlCount === 1
        ? ""
        : "s"})`,
    );
    return response;
  },
};
