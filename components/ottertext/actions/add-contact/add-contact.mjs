import ottertext from "../../ottertext.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ottertext-add-contact",
  name: "Add or Update Contact",
  description: "Adds a new contact or updates an existing one using the phone number as a unique identifier. If the customer record exists, it gets updated; if not, a new record is created and an opt-in message is sent.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ottertext,
    phoneNumber: ottertext.propDefinitions.phoneNumber,
  },
  async run({ $ }) {
    const response = await this.ottertext.addOrUpdateContact({
      phoneNumber: this.phoneNumber,
    });

    // Check if a new contact was added and send an opt-in message
    if (response.status === "new") {
      const messageContent = "[Company_Name]: Reply with your birthday YES to opt-in. Msg & data rates may apply. STOP to stop. HELP for assistance.";
      await this.ottertext.sendMessage({
        customerId: response.customerId,
        messageContent,
      });
      $.export("$summary", `New contact added and opt-in message sent to ${this.phoneNumber}`);
    } else {
      $.export("$summary", `Contact with phone number ${this.phoneNumber} updated.`);
    }

    return response;
  },
};
