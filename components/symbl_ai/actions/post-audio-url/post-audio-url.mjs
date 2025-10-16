import symblAIApp from "../../symbl_ai.app.mjs";
import languages from "../common/languages.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "symbl_ai-post-audio-url",
  name: "Submit Audio URL",
  description: "Submit an Audio file by providing the URL for processing. See the doc [here](https://docs.symbl.ai/docs/async-api/overview/audio/post-audio-url).",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    audioUrl: {
      type: "string",
      label: "Audio URL",
      description: "The URL of the audio file to be processed.",
    },
    meetingName: {
      type: "string",
      label: "Meeting Name",
      description: "The meeting name. The default name is set to the conversationId.",
      optional: true,
    },
    customVocabulary: {
      type: "string[]",
      label: "Custom Vocabulary",
      description: "List of words and phrases that provide hints to the speech recognition task.",
      optional: true,
    },
    confidenceThreshold: {
      type: "string",
      label: "Confidence Threshold",
      description: "Minimum confidence score that you can set for an API to consider it as a valid insight (action items, follow-ups, topics, and questions). It should be in the range <=0.5 to <=1.0 (i.e., greater than or equal to 0.5 and less than or equal to 1.0.). The default value is 0.5.",
      optional: true,
    },
    detectPhrases: {
      type: "boolean",
      label: "Detect Phrases",
      description: "It shows Actionable Phrases in each sentence of conversation. These sentences can be found using the Conversation's Messages API. Accepts `true` or `false` values.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Webhook URL on which job updates to be sent.",
      optional: true,
    },
    detectEntities: {
      type: "boolean",
      label: "Detect Entities",
      description: "It returns any entities detected in the conversation. See [Entities API](https://docs.symbl.ai/docs/conversation-api/entities) for reference. Default value is false.",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Language used in the conversation. See [supported languages](https://docs.symbl.ai/docs/async-api/overview/async-api-supported-languages) for reference. Default language is English (en-US).",
      options: languages,
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Set this parameter to `phone` when the audio is generated from a phone call (8khz sampling rate). The `default` mode works for audio generated from a video or audio meeting (16khz or higher sampling rate).",
      options: [
        "default",
        "phone",
      ],
      optional: true,
    },
    enableSeparateRecognitionPerChannel: {
      type: "boolean",
      label: "Enable Separate Recognition per Channel",
      description: "Enables Speaker Separated Channel audio processing. Accepts `true` or `false` values.",
      optional: true,
    },
    enableAllTrackers: {
      type: "boolean",
      label: "Enable All Trackers",
      description: "Set this parameter to `true` to enable detection of all the Trackers configured for your account. Default value is `false`.",
      optional: true,
    },
    enableSpeakerDiarization: {
      type: "boolean",
      label: "Enable Speaker Diarization",
      description: "Set this parameter to `true` to enable Speaker Separation. Default value is `false`.  See [Speaker Separation](https://docs.symbl.ai/docs/async-api/overview/audio/post-audio-url/#speaker-separation) for reference.",
      optional: true,
    },
    diarizationSpeakerCount: {
      type: "string",
      label: "Number of Speakers",
      description: "The number of unique speakers in this conversation. See [Speaker Separation](https://docs.symbl.ai/docs/async-api/overview/audio/post-audio-url/#speaker-separation) for reference.",
      optional: true,
    },
    trackers: {
      type: "string",
      label: "Trackers",
      description: "Provide a JSON array of the information to be tracked containing the `name` and the `vocabulary` information. The tracker object is represented by the following structure: `[{\"name\": \"Promotion Mention\",\"vocabulary\": [\"We have a special promotion going on if you book this before\",\"I can offer you a discount of 10 or 20 percent you being a new customer for us\",\"We have a sale right now on\"]}]`. See doc [here](https://docs.symbl.ai/docs/management-api/trackers/create-tracker).",
      optional: true,
    },
    channelMetadata: {
      type: "string",
      label: "Channel Metadata",
      description: "Provide a JSON array of participants with their `channel` and `speaker` information. Each participant object is represented by the following structure:  `[{\"channel\": 1,\"speaker\": {\"name\": \"Joe Doe\",\"email\": \"joe@doe.com\"}},{\"channel\": 2,\"speaker\": {\"name\": \"Mary Jones\",\"email\": \"mary@email.com\"}}]`. See doc [here](https://docs.symbl.ai/docs/async-api/overview/video/post-video#channel-metadata)",
      optional: true,
    },
    enableSummary: {
      type: "boolean",
      label: "Enable Summary",
      description: "Generate the Conversation summary automatically. Accepts `true` or `false` values.",
      optional: true,
    },
  },
  async run({ $ }) {
    const trackers = utils.emptyStrToUndefined(this.trackers);
    const channelMetadata = utils.emptyStrToUndefined(this.channelMetadata);
    const response =
      await this.symblAIApp.postAudioUrl({
        $,
        data: {
          url: this.audioUrl,
          name: this.meetingName,
          customVocabulary: this.customVocabulary,
          confidenceThreshold: this.confidenceThreshold,
          detectPhrases: this.detectPhrases,
          webhookUrl: this.webhookUrl,
          detectEntities: this.detectEntities,
          languageCode: this.languageCode,
          mode: this.mode,
          enableSeparateRecognitionPerChannel: this.enableSeparateRecognitionPerChannel,
          enableAllTrackers: this.enableAllTrackers,
          enableSpeakerDiarization: this.enableSpeakerDiarization,
          diarizationSpeakerCount: this.diarizationSpeakerCount,
          trackers: JSON.parse(trackers || "[]"),
          channelMetadata: JSON.parse(channelMetadata || "[]"),
          enableSummary: this.enableSummary,
        },
      });
    $.export("$summary", `Successfully posted audio file URL for processing with Conversation Id: ${response.conversationId} and Job Id: ${response.jobId}`);
    return response;
  },
};
