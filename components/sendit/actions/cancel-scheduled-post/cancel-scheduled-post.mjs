import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-cancel-scheduled-post",
  name: "Cancel Scheduled Post",
  description: "Cancel a scheduled post before it is published. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
