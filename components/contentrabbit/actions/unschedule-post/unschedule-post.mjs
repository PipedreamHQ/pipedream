import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-unschedule-post",
  name: "Unschedule Post",
  description: "Clears the scheduled time from a post and returns it to `draft` status. This is reversible: the Schedule Post action can set a new schedule. It deletes nothing. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    contentRabbitApp,
    postId: {
      propDefinition: [
        contentRabbitApp,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.unschedulePost({
      $,
      postId: this.postId,
    });
    $.export("$summary", `Unscheduled post "${this.postId}"`);
    return response;
  },
};
