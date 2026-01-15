import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-schedule-post",
  name: "Schedule Post",
  description: "Schedule content to be published at a future time. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    sendIt,
    platforms: {
      propDefinition: [
        sendIt,
        "platforms",
      ],
    },
    text: {
      propDefinition: [
        sendIt,
        "text",
      ],
    },
    mediaUrl: {
      propDefinition: [
        sendIt,
        "mediaUrl",
      ],
    },
    scheduledTime: {
      propDefinition: [
        sendIt,
        "scheduledTime",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sendIt.schedulePost({
      $,
      platforms: this.platforms,
      text: this.text,
      mediaUrl: this.mediaUrl,
      scheduledTime: this.scheduledTime,
    });
    $.export("$summary", `Successfully scheduled post for ${this.scheduledTime}`);
    return response;
  },
};
