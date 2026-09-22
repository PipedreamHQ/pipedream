import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-trigger-scheduled-post",
  name: "Trigger Scheduled Post Now",
  description: "Immediately publish a scheduled post. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    const response = await this.sendIt.triggerScheduledPost({
      $,
      scheduleId: this.scheduleId,
    });
    $.export("$summary", `Successfully triggered scheduled post ${this.scheduleId}`);
    return response;
  },
};
