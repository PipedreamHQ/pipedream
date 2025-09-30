import chatbotkit from "../../chatbotkit.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "chatbotkit-create-conversation",
  name: "Create Conversation",
  description: "Creates a new conversation in the bot. [See the documentation](https://chatbotkit.com/docs/api/v1/spec)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatbotkit,
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of the message",
      options: constants.MESSAGE_TYPE,
    },
    message: {
      propDefinition: [
        chatbotkit,
        "message",
      ],
    },
    botId: {
      propDefinition: [
        chatbotkit,
        "botId",
      ],
      optional: true,
    },
    backstory: {
      type: "string",
      label: "Backstory",
      description: "The backstory for the conversation",
      optional: true,
    },
    model: {
      propDefinition: [
        chatbotkit,
        "model",
      ],
      optional: true,
    },
    datasetId: {
      propDefinition: [
        chatbotkit,
        "datasetId",
      ],
      optional: true,
    },
    skillsetId: {
      propDefinition: [
        chatbotkit,
        "skillsetId",
      ],
      optional: true,
    },
    privacy: {
      type: "boolean",
      label: "Privacy",
      description: "Turn conversation privacy features on",
      optional: true,
    },
    moderation: {
      type: "boolean",
      label: "Moderation",
      description: "Turn conversation moderation features on",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.botId && (this.datasetId || this.skillsetId)) {
      throw new ConfigurationError("Dataset ID & Skillset ID not for use with Bot ID.");
    }
    const conversation = await this.chatbotkit.createConversation({
      data: {
        botId: this.botId,
        backstory: this.backstory,
        model: this.model,
        datasetId: this.datasetId,
        skillsetId: this.skillsetId,
        privacy: this.privacy,
        moderation: this.moderation,
        messages: [
          {
            type: this.messageType,
            text: this.message,
          },
        ],
      },
      $,
    });
    $.export("$summary", `Created conversation with ID: ${conversation.id}`);
    return conversation;
  },
};
