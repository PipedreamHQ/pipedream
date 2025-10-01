import messagebird from "../../messagebird.app.mjs";

export default {
  key: "messagebird-send-voice-message",
  name: "Send Voice Message",
  description: "Send a voice message to any phone number globally. [See the documentation](https://docs.bird.com/api/voice-api/voice-calls-api/initiate-an-outbound-call)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    messagebird,
    workspaceId: {
      propDefinition: [
        messagebird,
        "workspaceId",
      ],
    },
    channelId: {
      propDefinition: [
        messagebird,
        "channelId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    recipientNumber: {
      type: "string",
      label: "Recipient Number",
      description: "The phone number to send the message to. Example: `+351000000000`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send as a voice message",
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.sendVoiceMessage({
      $,
      workspaceId: this.workspaceId,
      channelId: this.channelId,
      data: {
        to: this.recipientNumber,
        callFlow: [
          {
            options: {
              text: this.message,
            },
            command: "say",
          },
          {
            command: "hangup",
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent voice message with ID: ${response.id}`);
    return response;
  },
};
