import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-speech-to-text",
  name: "Get Speech to Text",
  description: "Get a list of all the messages in a conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/messages)",
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
    verbose: {
      type: "boolean",
      label: "Verbose",
      description: "Provides you the word level timestamps and score for each sentence",
      optional: true,
      default: false,
    },
    sentiment: {
      type: "boolean",
      label: "Sentiment",
      description: "Provides you the sentiment analysis for each sentence",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    try {
      const { messages } = await this.symblAIApp.getSpeechToText({
        $,
        conversationId: this.conversationId,
        params: {
          verbose: this.verbose,
          sentiment: this.sentiment,
        },
      });
      $.export("$summary", `Successfully retrieved ${messages.length} Speech to Text message${messages.length === 1
        ? ""
        : "s"} from the conversation`);
      return messages;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Speech to Text messages from the conversation");
    }
  },
};
