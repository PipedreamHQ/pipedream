import app from "../../easy_peasy_ai.app.mjs";

export default {
  key: "easy_peasy_ai-create-transcription",
  name: "Create Transcription",
  description: "Generates AI transcription for a given audio URL. [See the documentation](https://easy-peasy.ai/audios)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "Audio URL",
      description: "The URL of the audio file to transcribe.",
    },
    audioType: {
      type: "string",
      label: "Audio Type",
      description: "The type of the audio file. Eg. `podcast`, `meeting`.",
      optional: true,
    },
    language: {
      description: "The language of the audio E.g. `English`, `Chinese`, `French`.",
      propDefinition: [
        app,
        "language",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the transcription.",
      optional: true,
    },
    detectSpeakers: {
      type: "boolean",
      label: "Detect Speakers",
      description: "Whether to detect multiple speakers.",
      optional: true,
    },
    enhanceQuality: {
      type: "boolean",
      label: "Enhance Quality",
      description: "Whether to use enhanced quality for transcription.",
      optional: true,
    },
  },
  methods: {
    generateTranscription(args = {}) {
      return this.app.post({
        path: "/transcriptions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateTranscription,
      url,
      audioType,
      language,
      name,
      detectSpeakers,
      enhanceQuality,
    } = this;

    const response = await generateTranscription({
      $,
      data: {
        url,
        audio_type: audioType,
        language,
        name,
        detect_speakers: detectSpeakers,
        enhance_quality: enhanceQuality,
      },
    });
    $.export("$summary", `Successfully created a transcription with ID \`${response.uuid}\`.`);
    return response;
  },
};
