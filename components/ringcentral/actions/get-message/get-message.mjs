import ringcentral from "../../ringcentral.app.mjs";

export default {
  key: "ringcentral-get-message",
  name: "Get Message",
  description: "Get message from the Message Store. See the API docs [here](https://developers.ringcentral.com/api-reference/Message-Store/readMessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    extensionId: {
      type: "string",
      label: "Extension ID",
      description: "Extension ID of the message.",
      propDefinition: [
        ringcentral,
        "extensionId",
      ],
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message.",
    },
  },
  async run({ $ }) {
    const response = await this.ringcentral.getMessage({
      $,
      accountId: this.accountId,
      extensionId: this.extensionId,
      messageId: this.messageId,
    });

    $.export("$summary", `Successfully retrieved message with ID ${this.messageId}`);

    return response;
  },
};
