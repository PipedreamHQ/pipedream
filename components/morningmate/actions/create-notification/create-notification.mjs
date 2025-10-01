import morningmate from "../../morningmate.app.mjs";

export default {
  key: "morningmate-create-notification",
  name: "Create Notification",
  description: "Sends a notification message to the user. [See the documentation](https://api.morningmate.com/docs/api/bots#createBotNotification-metadata)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    morningmate,
    botId: {
      propDefinition: [
        morningmate,
        "botId",
      ],
    },
    receiverId: {
      propDefinition: [
        morningmate,
        "userId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the notification",
    },
    contents: {
      type: "string",
      label: "Message",
      description: "The text of the notification message",
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to include in the notification",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.sendNotification({
      $,
      botId: this.botId,
      data: {
        receiverId: this.receiverId,
        title: this.title,
        contents: this.contents,
        url: this.url,
      },
    });
    $.export("$summary", `Successfully sent notification: ${this.contents}`);
    return response;
  },
};
