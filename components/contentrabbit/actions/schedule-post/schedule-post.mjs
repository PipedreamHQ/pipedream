import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-schedule-post",
  name: "Schedule Post",
  description: "Set or update the scheduled time for a post. Status changes to `scheduled`. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/schedulePost)",
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
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "ISO 8601 datetime for when the post should be published.",
    },
    selectedPlatforms: {
      type: "string[]",
      label: "Platforms",
      description: "Override which platforms to schedule for.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.schedulePost({
      $,
      postId: this.postId,
      data: {
        scheduledAt: this.scheduledAt,
        selectedPlatforms: this.selectedPlatforms,
      },
    });
    $.export("$summary", `Scheduled post "${this.postId}" for ${this.scheduledAt}`);
    return response;
  },
};