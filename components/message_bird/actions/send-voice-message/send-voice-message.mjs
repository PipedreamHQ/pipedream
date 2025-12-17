import messagebird from "../../message_bird.app.mjs";

export default {
  key: "message_bird-send-voice-message",
  name: "Send Voice Message",
  description: "Sends a voice message. [See the documentation](https://developers.messagebird.com/api/voice-messaging/#send-a-voice-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    messagebird,
    body: {
      propDefinition: [
        messagebird,
        "body",
      ],
    },
    recipients: {
      propDefinition: [
        messagebird,
        "recipients",
      ],
    },
    originator: {
      propDefinition: [
        messagebird,
        "originator",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.sendVoiceMessage({
      $,
      data: {
        body: this.body,
        recipients: typeof this.recipients === "string"
          ? JSON.parse(this.recipients)
          : this.recipients,
        originator: this.originator,
      },
    });
    $.export("$summary", `Successfully sent voice message with ID ${response.id}`);
    return response;
  },
};
