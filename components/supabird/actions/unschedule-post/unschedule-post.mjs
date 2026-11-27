import app from "../../supabird.app.mjs";

export default {
  key: "supabird-unschedule-post",
  name: "Unschedule Post",
  description: "Cancel a scheduled post on X and every other network. A post that has not gone out is moved to Drafts, so nothing is lost; a scheduled repost is cancelled. Use **Create Post** to get a post ID. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.unschedulePost({
      $,
      postId: this.postId,
    });
    $.export("$summary", `Unscheduled post ${response.id ?? this.postId}`);
    return response;
  },
};
