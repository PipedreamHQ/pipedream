import assemblyai from "../../assemblyai.app.mjs";

export default {
  name: "Get Transcription",
  description: "Fetches a specific transcribed result from the AssemblyAI API. [See the documentation](https://www.assemblyai.com/docs/API%20reference/transcript)",
  key: "assemblyai-get-transcription",
  version: "0.0.2",
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
    callbackWithRerun: {
      type: "boolean",
      label: "Callback With Rerun",
      description: "Use the `$.flow.rerun` Node.js helper to rerun the step when the transcription is completed. Overrides the `webhookUrl` prop. This will increase execution time and credit usage as a result. [See the documentation(https://pipedream.com/docs/code/nodejs/rerun/#flow-rerun)",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const { run } = $.context;
    if (run.runs === 1) {
      let webhookUrl  = this.webhookUrl;
      if (this.callbackWithRerun) {
        ({ resume_url: webhookUrl } = $.flow.rerun(600000, null, 1));
      }
      response = await this.assemblyai.createTranscript({
        data: {
          audio_url: this.url,
          language_code: this.languageCode,
          punctuate: this.punctuate,
          speaker_labels: this.speakerLabels,
          content_safety: this.contentSafety,
          sentiment_analysis: this.sentimentAnalysis,
          webhook_url: webhookUrl,
        },
        $,
      });
    }
    if (run.callback_request) {
      response = await this.assemblyai.getTranscript({
        transcriptId: run.callback_request.body.transcript_id,
      });
    }

    if (response?.id) {
      $.export("$summary", `Successfully created transcription with ID ${response.id}.`);
    }

    return response;
  },
};
