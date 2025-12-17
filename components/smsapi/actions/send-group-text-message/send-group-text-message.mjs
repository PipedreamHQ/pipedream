import smsapi from "../../smsapi.app.mjs";

export default {
  key: "smsapi-send-group-text-message",
  name: "Send Group Text Message",
  description: "Sends a group text message using SMSAPI. [See the documentation](https://www.smsapi.com/docs/#2-single-sms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smsapi,
    group: {
      type: "string",
      label: "Group",
      description: "Name of the group to send message to",
    },
    from: {
      propDefinition: [
        smsapi,
        "senderName",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message text",
    },
  },
  async run({ $ }) {
    const response = await this.smsapi.sendMessage({
      data: {
        group: this.group,
        from: this.from,
        message: this.message,
      },
      $,
    });

    if (response?.includes("OK")) {
      $.export("$summary", "Successfully sent text message to group.");
    } else {
      throw new Error(`${response}, See Error Code Descriptions - https://www.smsapi.com/docs/#18-error-codes`);
    }

    return response;
  },
};
