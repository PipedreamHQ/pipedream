import messagebird from "../../messagebird.app.mjs";

export default {
  key: "messagebird-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message. [See the documentation](https://docs.bird.com/api/channels-api/supported-channels/programmable-sms/sending-sms-messages)",
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
    contactId: {
      propDefinition: [
        messagebird,
        "contactId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message text to send",
    },
  },
  async run({ $ }) {
    const response = await this.messagebird.sendSmsMessage({
      $,
      workspaceId: this.workspaceId,
      channelId: this.channelId,
      data: {
        receiver: {
          contacts: [
            {
              id: this.contactId,
            },
          ],
        },
        body: {
          type: "text",
          text: {
            text: this.message,
          },
        },
      },
    });
    $.export("$summary", `Successfully sent SMS message with ID: ${response.id}`);
    return response;
  },
};
