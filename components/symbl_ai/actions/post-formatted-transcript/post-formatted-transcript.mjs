import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-post-formatted-transcript",
  name: "Create Formatted Transcript",
  description: "Create formatted transcript from the Conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/transcript/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    contentType: {
      propDefinition: [
        symblAIApp,
        "contentType",
      ],
      optional: false,
    },
    createParagraphs: {
      type: "boolean",
      label: "Create Paragraphs",
      description: "Break transcript down into logical paragraphs.",
      optional: true,
    },
    highlightOnlyInsightKeyPhrases: {
      type: "boolean",
      label: "Highlight Insights Phrases",
      description: "Highlight Insights key phrases.",
      optional: true,
    },
    highlightAllKeyPhrases: {
      type: "boolean",
      label: "Highlight All Key Phrases",
      description: "Highlight all key phrases.",
      optional: true,
    },
    showSpeakerSeparation: {
      type: "boolean",
      label: "Separate Sentence by Speaker",
      description: "Generate the transcript with each sentence separated by speaker.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.postFormattedTranscript({
        $,
        conversationId: this.conversationId,
        data: {
          contentType: this.contentType,
          createParagraphs: this.createParagraphs,
          phrases: {
            highlightOnlyInsightKeyPhrases: this.highlightOnlyInsightKeyPhrases,
            highlightAllKeyPhrases: this.highlightAllKeyPhrases,
          },
          showSpeakerSeparation: this.showSpeakerSeparation,
        },
      });
    $.export("$summary", `Successfully generated formatted transcript for ${response.transcript.contentType}.`);
    return response;
  },
};
