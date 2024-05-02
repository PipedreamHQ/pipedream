import fractel from "../../fractel.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fractel-send-sms-mms",
  name: "Send SMS or MMS",
  description: "Allows to send an SMS or MMS to a particular phone number. [See the documentation](https://developer.fonestorm.com/reference/sendmessage)",
  version: "0.0.1",
  type: "action",
  props: {
    fractel,
    to: fractel.propDefinitions.to,
    phoneNumber: fractel.propDefinitions.phoneNumber,
    message: {
      ...fractel.propDefinitions.message,
      optional: true,
    },
    media: {
      ...fractel.propDefinitions.media,
      optional: true,
    },
    confirmationUrl: {
      ...fractel.propDefinitions.confirmationUrl,
      optional: true,
    },
    confirmationUrlUsername: {
      ...fractel.propDefinitions.confirmationUrlUsername,
      optional: true,
    },
    confirmationUrlPassword: {
      ...fractel.propDefinitions.confirmationUrlPassword,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.message && !this.media) {
      throw new Error("Either message or media must be provided.");
    }

    const data = {
      to: this.to,
      from: this.phoneNumber,
      message: this.message,
      media: this.media,
      confirmation_url: this.confirmationUrl,
      confirmation_url_username: this.confirmationUrlUsername,
      confirmation_url_password: this.confirmationUrlPassword,
    };

    const response = await this.fractel.sendMessage(data);

    $.export("$summary", `Successfully sent ${this.message
      ? "SMS"
      : "MMS"} to ${this.to}`);
    return response;
  },
};
