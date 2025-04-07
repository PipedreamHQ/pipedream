import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-send-message",
  name: "Send a Text Message",
  description: "Send a text message from your OpenPhone number to a recipient. [See the documentation](https://www.openphone.com/docs/api-reference/messages/send-a-text-message)",
  version: "0.0.2",
  type: "action",
  props: {
    openphone,
    from: {
      propDefinition: [
        openphone,
        "from",
      ],
    },
    to: {
      type: "string",
      label: "To",
      description: "Recipient phone number in E.164 format.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text content of the message to be sent.",
    },
  },
  async run({ $ }) {
    const response = await this.openphone.sendTextMessage({
      $,
      data: {
        content: this.content,
        from: this.from,
        to: [
          this.to,
        ],
        setInboxStatus: "done",
      },
    });
    $.export("$summary", `Successfully sent message to ${this.to}`);
    return response;
  },
};
