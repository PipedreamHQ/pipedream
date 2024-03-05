import proofly from "../../proofly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proofly-find-notification",
  name: "Find Notification",
  description: "Retrieve information of a specific notification using its unique ID. [See the documentation](https://proofly.io/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    proofly,
    notificationId: {
      propDefinition: [
        proofly,
        "notificationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proofly.getNotificationById({
      notificationId: this.notificationId,
    });

    $.export("$summary", `Successfully retrieved notification with ID: ${this.notificationId}`);
    return response;
  },
};
