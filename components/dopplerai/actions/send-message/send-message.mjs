import dopplerai from "../../dopplerai.app.mjs";

export default {
  key: "dopplerai-send-message",
  name: "Send Message",
  description: "Dispatches a message to the artificial intelligence. [See the documentation](https://api.dopplerai.com/docs/reference#tag/Messages/operation/send_message_v1_messages_post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dopplerai,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Prompt that is added prior to the content",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
    memorize: {
      type: "boolean",
      label: "Memorize",
      description: "Memorize the conversation to memory",
    },
    remember: {
      type: "boolean",
      label: "Remember",
      description: "Remember past conversations that have been memorized",
    },
    chatUuid: {
      propDefinition: [
        dopplerai,
        "chatUuid",
      ],
    },
    collectionUuid: {
      propDefinition: [
        dopplerai,
        "collectionUuid",
      ],
    },
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The name of the large language model. Default: `gpt-3.5-turbo`",
      default: "gpt-3.5-turbo",
      optional: true,
    },
    temperature: {
      type: "integer",
      label: "Temperature",
      description: "The temperature of the large language model. Default: `0`",
      default: 0,
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "The frequency penalty of the large language model. Default: `0.7`",
      default: "0.7",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dopplerai.sendMessage({
      $,
      data: {
        message: {
          prompt: this.prompt,
          content: this.content,
          chat_uuid: this.chatUuid,
        },
        large_language_model: {
          model_name: this.modelName,
          temperature: this.temperature,
          frequency_penalty: this.frequencyPenalty,
        },
        memory: {
          memorize: this.memorize,
          remember: this.remember,
        },
        vector_database: this.collectionUuid
          ? {
            collection_uuid: this.collectionUuid,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully sent message with UUID ${response.uuid}`);
    return response;
  },
};
