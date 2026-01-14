import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-list-scheduled-posts",
  name: "List Scheduled Posts",
  description: "Get a list of pending scheduled posts. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "1.0.0",
  type: "action",
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
