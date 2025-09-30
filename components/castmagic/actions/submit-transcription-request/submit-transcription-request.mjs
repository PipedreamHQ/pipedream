import castmagic from "../../castmagic.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "castmagic-submit-transcription-request",
  name: "Submit Transcription Request",
  description: "Submits a request to transcribe from a URL. [See the documentation](https://docs.castmagic.io/endpoints/transcripts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    castmagic,
    url: {
      type: "string",
      label: "File URL",
      description: "URL of the recording file to transcribe. Supported formats: aac, m4a, mp4, mpeg, wav, Public YouTube videos",
    },
    boostedWords: {
      type: "string[]",
      label: "Boosted Words",
      description: "List of words to boost when transcribing",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Language code. Defaults to `en`.",
      options: constants.LANGUAGES,
      optional: true,
    },
    languageDetection: {
      type: "boolean",
      label: "Language Detection",
      description: "Attempt to automatically detect the content language. Will be overridden by `language_code` if included",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the transcription is completed",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = await this.castmagic.submitTranscriptionRequest({
      $,
      data: {
        url: this.url,
        boosted_words: this.boostedWords,
        language_code: this.languageCode,
        language_detection: this.languageDetection,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status !== "completed") {
        response = await this.castmagic.getTranscription({
          $,
          transcriptionId: response.id,
        });
        if (response.status === "error") {
          throw new Error(`${response.error}`);
        }
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully created transcription request with ID ${response.id}`);
    return response;
  },
};
