import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-cancel-scheduled-post",
  name: "Cancel Scheduled Post",
  description: "Cancel a scheduled post before it is published. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "1.0.0",
  type: "action",
  props: {
    sendIt,
    scheduleId: {
      propDefinition: [
        sendIt,
        "scheduleId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendIt.cancelScheduledPost({
      $,
      scheduleId: this.scheduleId,
    });
    $.export("$summary", `Successfully cancelled scheduled post ${this.scheduleId}`);
    return response;
  },
};
