import waboxapp from "../../waboxapp.app.mjs";

export default {
  key: "waboxapp-send-text-message",
  name: "Send Text Message",
  description: "Send a WhatsApp message to a specific phone number. [See the documentation](https://www.waboxapp.com/assets/doc/waboxapp-API-v3.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    waboxapp,
    uid: {
      propDefinition: [
        waboxapp,
        "uid",
      ],
    },
    to: {
      propDefinition: [
        waboxapp,
        "to",
      ],
    },
    customUid: {
      propDefinition: [
        waboxapp,
        "customUid",
      ],
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text message to send",
    },
  },
  async run({ $ }) {
    const response = await this.waboxapp.sendMessage({
      $,
      data: {
        uid: this.uid,
        to: this.to,
        custom_uid: this.customUid,
        text: this.text,
      },
    });

    $.export("$summary", `Successfully sent message to ${this.to}`);
    return response;
  },
};
