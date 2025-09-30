import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-questions",
  name: "Get Questions",
  description: "Get a list of requests for information or explicit questions recognized during the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/questions)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const { questions } = await this.symblAIApp.getQuestions({
        $,
        conversationId: this.conversationId,
      });
      $.export("$summary", `Successfully retrieved ${questions.length} Question${questions.length === 1
        ? ""
        : "s"} from the conversation`);
      return questions;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Questions from the conversation");
    }
  },
};
