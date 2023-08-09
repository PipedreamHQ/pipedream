import assemblyai from "../../assemblyai.app.mjs";

export default {
  name: "Transcribe Audio",
  description: "Causes the API to start transcribing a given audio file. [See the documentation](https://www.assemblyai.com/docs/API%20reference/transcript)",
  key: "assemblyai-transcribe-audio",
  version: "0.0.1",
  type: "action",
  props: {
    assemblyai,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of your media file to transcribe.",
    },
    languageCode: {
      propDefinition: [
        assemblyai,
        "languageCode",
      ],
    },
    punctuate: {
      type: "boolean",
      label: "Punctuate",
      description: "Enable Automatic Punctuation",
      optional: true,
    },
    speakerLabels: {
      type: "boolean",
      label: "Speaker Labels",
      description: "Enable Speaker diarization",
      optional: true,
    },
    contentSafety: {
      type: "boolean",
      label: "Content Safety",
      description: "Enable Content Moderation",
      optional: true,
    },
    sentimentAnalysis: {
      type: "boolean",
      label: "Sentiment Analysis",
      description: "Enable Sentiment Analysis",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL we should send webhooks to when your transcript is complete",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.assemblyai.createTranscript({
      data: {
        audio_url: this.url,
        language_code: this.languageCode,
        punctuate: this.punctuate,
        speaker_labels: this.speakerLabels,
        content_safety: this.contentSafety,
        sentiment_analysis: this.sentimentAnalysis,
        webhook_url: this.webhookUrl,
      },
      $,
    });

    $.export("$summary", `Successfully created transcription with ID ${response.id}.`);

    return response;
  },
};
