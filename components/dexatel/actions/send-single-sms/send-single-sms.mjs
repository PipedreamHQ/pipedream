import dexatel from "../../dexatel.app.mjs";

export default {
  key: "dexatel-send-single-sms",
  name: "Send Single SMS",
  description: "Sends a single SMS to a specified recipient. [See the documentation](https://dexatel.com/developers/messages-add)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dexatel,
    senderId: {
      propDefinition: [
        dexatel,
        "senderId",
      ],
    },
    recipientNumber: {
      propDefinition: [
        dexatel,
        "recipientNumber",
      ],
    },
    messageContent: {
      propDefinition: [
        dexatel,
        "messageContent",
      ],
    },
    templateId: {
      propDefinition: [
        dexatel,
        "templateId",
      ],
      optional: true,
    },
    variables: {
      type: "string[]",
      label: "Variables",
      description: "List of the template values",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dexatel.sendMessage({
      $,
      data: {
        data: {
          from: this.senderId,
          to: [
            this.recipientNumber,
          ],
          text: this.messageContent,
          channel: "SMS",
          template: this.templateId,
          variables: this.variables,
        },
      },
    });
    $.export("$summary", `Successfully sent message to ${this.recipientNumber}`);
    return response;
  },
};
