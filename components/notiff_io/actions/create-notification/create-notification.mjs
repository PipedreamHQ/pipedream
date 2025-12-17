import app from "../../notiff_io.app.mjs";

export default {
  key: "notiff_io-create-notification",
  name: "Create Notification",
  description: "Send a new notification to a user or system via notiff.io. [See the documentation](https://notiff.io/articles/welcome-to-notiff-getting-started-with-your-notification-center)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    idNotificationSource: {
      type: "string",
      label: "ID Notification Source",
      description: "To get your Notification Source ID, sign in to Notiff, go to the Settings menu with the gear icon on the top right, click the \"Settings\" option. Copy your Notification Source ID from the list.",
      secret: true,
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    getNotificationSourceId() {
      return this.idNotificationSource;
    },
  },
  async run({ $ }) {
    const response = await this.app.createNotification({
      $,
      data: {
        id_notification_source: this.getNotificationSourceId(),
        title: this.title,
        description: this.description,
        url: this.url,
      },
    });

    $.export("$summary", `Notification titled "${this.title}" created successfully!`);
    return response;
  },
};
