import breathe from "../../breathe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "breathe-send-relaxation-reminder",
  name: "Send Relaxation Reminder",
  description: "Sends a personalized reminder to begin a relaxation or breathing session. [See the documentation](https://developer.breathehr.com/documentation/introduction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    breathe,
    reminderMessage: {
      propDefinition: [
        breathe,
        "reminderMessage",
      ],
    },
    deliveryTime: {
      propDefinition: [
        breathe,
        "deliveryTime",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.breathe.sendReminder({
      reminderMessage: this.reminderMessage,
      deliveryTime: this.deliveryTime,
    });
    $.export("$summary", `Sent relaxation reminder scheduled at ${this.deliveryTime}`);
    return response;
  },
};
