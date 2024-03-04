import gptTrainer from "../../gpt_trainer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gpt_trainer-create-session",
  name: "Create Chat Session",
  description: "Create a chat session for a chatbot specified by chatbot UUID. [See the documentation](https://guide.gpt-trainer.com/api-reference/sessions/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gptTrainer,
    chatbotUuid: {
      propDefinition: [
        gptTrainer,
        "chatbotUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gptTrainer.createChatSession({
      chatbotUuid: this.chatbotUuid,
    });

    $.export("$summary", `Successfully created chat session with UUID: ${response.uuid}`);
    return response;
  },
};
