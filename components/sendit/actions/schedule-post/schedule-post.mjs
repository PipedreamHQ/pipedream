import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-schedule-post",
  name: "Schedule Post",
  description: "Schedule content to be published at a future time. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    mediaUrls: {
      propDefinition: [
        sendIt,
        "mediaUrls",
      ],
    },
    mediaType: {
      propDefinition: [
        sendIt,
        "mediaType",
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
      mediaUrls: this.mediaUrls,
      mediaType: this.mediaType,
      scheduledTime: this.scheduledTime,
    });
    $.export("$summary", `Successfully scheduled post for ${this.scheduledTime}`);
    return response;
  },
};
