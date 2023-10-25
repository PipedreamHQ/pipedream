import app from "../../ez_texting_.app.mjs";

export default {
  name: "Send Text Message",
  version: "0.0.2",
  key: "ez_texting_-send-text-message",
  description: "Sends a text message. [See the documentation](https://developers.eztexting.com/reference/createusingpost_3)",
  type: "action",
  props: {
    app,
    message: {
      type: "string",
      label: "Message",
      description: "Message to be sent",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company. It will be added as a message prefix",
    },
    toNumbers: {
      type: "string[]",
      label: "Numbers",
      description: "Contact numbers to send the message to",
    },
  },
  async run({ $ }) {
    const response = await this.app.sendTextMessage({
      $,
      data: {
        message: this.message,
        companyName: this.companyName,
        toNumbers: this.toNumbers,
      },
    });

    if (response) {
      $.export("$summary", "Successfully sent message");
    }

    return response;
  },
};
