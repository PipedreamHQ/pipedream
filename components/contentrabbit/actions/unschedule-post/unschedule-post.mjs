import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-unschedule-post",
  name: "Unschedule Post",
  description: "Remove the scheduled time from a post. Reverts to `draft` status. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/unschedulePost)",
  version: "0.0.1",
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