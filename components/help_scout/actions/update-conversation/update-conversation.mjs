import helpScout from "../../help_scout.app.mjs";
import { CONVERSATION_OPERATIONS } from "../../common/constants.mjs";

export default {
  key: "help_scout-update-conversation",
  name: "Update Conversation",
  description: "Updates a conversation. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/conversations/update/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    helpScout,
    conversationId: {
      propDefinition: [
        helpScout,
        "conversationId",
      ],
    },
    operation: {
      type: "string",
      label: "Operation",
      description: "The operation to perform on the conversation",
      options: CONVERSATION_OPERATIONS.map(({ label }) => label),
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value to use for the operation",
    },
  },
  async run({ $ }) {
    const operation = CONVERSATION_OPERATIONS.find(({ label }) => label === this.operation);
    const value = operation.type === "boolean"
      ? this.value === "true"
      : operation.type === "number"
        ? +this.value
        : this.value;

    const response = await this.helpScout.updateConversation({
      conversationId: this.conversationId,
      data: {
        op: operation.operation,
        path: operation.path,
        value,
      },
    });

    $.export("$summary", `Successfully updated conversation with ID ${this.conversationId}`);

    return response;
  },
};
