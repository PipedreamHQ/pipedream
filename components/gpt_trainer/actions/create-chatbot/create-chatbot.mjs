import gptTrainer from "../../gpt_trainer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gpt_trainer-create-chatbot",
  name: "Create Chatbot",
  description: "Creates a new chatbot that belongs to the authenticated user. [See the documentation](https://guide.gpt-trainer.com/api-reference/chatbots/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gptTrainer,
    chatbotName: {
      propDefinition: [
        gptTrainer,
        "chatbotName",
      ],
    },
    chatbotPrompt: {
      propDefinition: [
        gptTrainer,
        "chatbotPrompt",
      ],
    },
    chatbotTemperature: {
      propDefinition: [
        gptTrainer,
        "chatbotTemperature",
      ],
    },
    chatbotModel: {
      propDefinition: [
        gptTrainer,
        "chatbotModel",
      ],
    },
    chatbotVisibility: {
      propDefinition: [
        gptTrainer,
        "chatbotVisibility",
      ],
    },
    chatbotRateLimit: {
      propDefinition: [
        gptTrainer,
        "chatbotRateLimit",
      ],
    },
    chatbotRateLimitMessage: {
      propDefinition: [
        gptTrainer,
        "chatbotRateLimitMessage",
      ],
    },
    chatbotShowCitations: {
      propDefinition: [
        gptTrainer,
        "chatbotShowCitations",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gptTrainer.createChatbot({
      chatbotName: this.chatbotName,
      chatbotPrompt: this.chatbotPrompt,
      chatbotTemperature: this.chatbotTemperature,
      chatbotModel: this.chatbotModel,
      chatbotVisibility: this.chatbotVisibility,
      chatbotRateLimit: this.chatbotRateLimit,
      chatbotRateLimitMessage: this.chatbotRateLimitMessage,
      chatbotShowCitations: this.chatbotShowCitations,
    });

    $.export("$summary", `Successfully created chatbot ${this.chatbotName}`);
    return response;
  },
};
