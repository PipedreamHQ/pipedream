import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-list-scheduled-posts",
  name: "List Scheduled Posts",
  description: "Get a list of pending scheduled posts. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendIt,
    platformFilter: {
      propDefinition: [
        sendIt,
        "platformFilter",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendIt.listScheduledPosts({
      $,
      platform: this.platformFilter,
    });
    $.export("$summary", `Found ${response.posts?.length || 0} scheduled post(s)`);
    return response;
  },
};
