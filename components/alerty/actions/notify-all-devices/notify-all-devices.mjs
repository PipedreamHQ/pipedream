import alerty from "../../alerty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alerty-notify-all-devices",
  name: "Notify All Devices",
  description: "Sends a notification to active devices. [See the documentation](https://alerty.dev/api/notify)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    alerty,
    message: {
      propDefinition: [
        alerty,
        "message",
      ],
    },
    title: {
      propDefinition: [
        alerty,
        "title",
      ],
    },
    image: {
      propDefinition: [
        alerty,
        "image",
      ],
    },
    icon: {
      propDefinition: [
        alerty,
        "icon",
      ],
    },
    deviceId: {
      propDefinition: [
        alerty,
        "deviceId",
      ],
    },
    urgency: {
      propDefinition: [
        alerty,
        "urgency",
      ],
    },
    actions: {
      propDefinition: [
        alerty,
        "actions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.alerty.sendNotification({
      message: this.message,
      title: this.title,
      image: this.image,
      icon: this.icon,
      deviceId: this.deviceId,
      urgency: this.urgency,
      actions: this.actions,
    });

    $.export("$summary", `Notification sent with message: "${this.message}"`);
    return response;
  },
};
