import ottertext from "../../ottertext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ottertext-send-message-scheduled",
  name: "Send Scheduled Message",
  description: "Schedule a message to a specific customer who has opted to receive messages. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ottertext,
    time: {
      propDefinition: [
        ottertext,
        "time",
      ],
    },
    customerId: {
      propDefinition: [
        ottertext,
        "customerId",
      ],
    },
    messageContent: {
      propDefinition: [
        ottertext,
        "messageContent",
        (c) => ({
          optional: true,
        }), // Making messageContent optional as per instructions
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ottertext.scheduleMessage({
      time: this.time,
      customerId: this.customerId,
      messageContent: this.messageContent || "", // Using an empty string if messageContent is not provided
    });
    $.export("$summary", `Scheduled message successfully for customer ID ${this.customerId}`);
    return response;
  },
};
