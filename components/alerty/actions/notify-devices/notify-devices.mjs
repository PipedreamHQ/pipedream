import alerty from "../../alerty.app.mjs";
import { URGENCY_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "alerty-notify-devices",
  name: "Notify Devices",
  description: "Sends a notification to active devices. [See the documentation](https://alerty.dev/api/notify)",
  version: "0.0.1",
  type: "action",
  props: {
    alerty,
    message: {
      type: "string",
      label: "Message",
      description: "The message to be included in the push notification.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for your notification message.",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "URL of an image to be displayed in the notification.",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon URL",
      description: "URL of an image to be used as an icon by the notification. Default: Alerty Logo",
      optional: true,
    },
    deviceId: {
      type: "string[]",
      label: "Device ID",
      description: "Specific device IDs to send the notification to. If no Device Id is included, the push message will be sent to all active devices on your account.",
      optional: true,
    },
    urgency: {
      type: "string",
      label: "Urgency",
      description: "Urgency of the notification. Default: very-low",
      options: URGENCY_OPTIONS,
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "Actions for the notification, each item should be a JSON string. Example: { \"action\": \"https://example.com\", \"title\": \"Open Site\", \"icon\": \"https://example.com/icon.png\" }",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.alerty.makeRequest({
      $,
      data: {
        message: this.message,
        title: this.title,
        image: this.image,
        icon: this.icon,
        device_id: parseObject(this.deviceId),
        urgency: this.urgency,
        actions: parseObject(this.actions),
      },
    });

    $.export("$summary", `Notification sent with message: "${this.message}"`);
    return response;
  },
};
