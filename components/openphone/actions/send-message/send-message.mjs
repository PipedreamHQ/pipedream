// x-pd-ai: optimized
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-send-message",
  name: "Send a Text Message",
  description: "Send a text message from one of your OpenPhone numbers to a recipient. Use **List Phone Numbers** (or **List From Options**) to find a valid `from` value. Example: call with from=\"PN123abc\", to=\"+15551234567\", content=\"Hi, following up on your request.\" → sends the message and returns the created message record. [See the documentation](https://www.openphone.com/docs/api-reference/messages/send-a-text-message)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
