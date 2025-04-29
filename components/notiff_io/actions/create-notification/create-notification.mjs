import notiff_io from "../../notiff_io.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "notiff_io-create-notification",
  name: "Create Notification",
  description: "Send a new notification to a user or system via notiff.io. [See the documentation](https://notiff.io/articles/welcome-to-notiff-getting-started-with-your-notification-center)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    notiff_io,
    idNotificationSource: {
      propDefinition: [
        notiff_io,
        "idNotificationSource",
      ],
    },
    title: {
      propDefinition: [
        notiff_io,
        "title",
      ],
    },
    description: {
      propDefinition: [
        notiff_io,
        "description",
      ],
    },
    url: {
      propDefinition: [
        notiff_io,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notiff_io.sendNotification({
      idNotificationSource: this.idNotificationSource,
      title: this.title,
      description: this.description,
      url: this.url,
    });

    $.export("$summary", `Notification titled "${this.title}" created successfully`);
    return response;
  },
};
