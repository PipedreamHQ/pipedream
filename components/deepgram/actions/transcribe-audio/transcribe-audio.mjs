import deepgram from "../../deepgram.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "deepgram-transcribe-audio",
  name: "Transcribe Audio",
  description: "Transcribes the specified audio file. [See the documentation](https://developers.deepgram.com/api-reference/transcription/#transcribe-pre-recorded-audio)",
  version: "0.0.4",
  type: "action",
  props: {
    deepgram,
    url: {
      type: "string",
      label: "URL",
      description: "URL of audio file to transcribe",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.mp3`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
    tier: {
      propDefinition: [
        deepgram,
        "tier",
      ],
    },
    model: {
      propDefinition: [
        deepgram,
        "model",
      ],
    },
    version: {
      type: "string",
      label: "Version",
      description: "Version of the model to use. Default: `latest`",
      default: "latest",
      optional: true,
    },
    language: {
      propDefinition: [
        deepgram,
        "language",
      ],
    },
    detectLanguage: {
      type: "boolean",
      label: "Detect Language",
      description: "Indicates whether to detect the language of the provided audio",
      default: true,
    },
    punctuate: {
      type: "boolean",
      label: "Punctuate",
      description: "Indicates whether to add punctuation and capitalization to the transcript",
      optional: true,
    },
    profanityFilter: {
      type: "boolean",
      label: "Profanity Filter",
      description: "Indicates whether to remove profanity from the transcript",
      optional: true,
    },
    redact: {
      propDefinition: [
        deepgram,
        "redact",
      ],
    },
    diarize: {
      type: "boolean",
      label: "Diarize",
      description: "Indicates whether to recognize speaker changes. When set to `true`, each word in the transcript will be assigned a speaker number starting at 0. To use the legacy diarization feature, set the `diarize_version` parameter set to `2021-07-14.0`.",
      optional: true,
    },
    diarizeVersion: {
      type: "string",
      label: "Diarize Version",
      description: "Indicates the version of the diarization feature to use. To use the legacy diarization feature, set the parameter value to `2021-07-14.0`. Only used when the diarization feature is enabled.",
      optional: true,
    },
    smartFormat: {
      type: "boolean",
      label: "Smart Format",
      description: "Applies additional formatting to transcripts to optimize them for human readability.",
      default: true,
    },
    multiChannel: {
      type: "boolean",
      label: "MultiChannel",
      description: "Indicates whether to transcribe each audio channel independently",
      optional: true,
    },
    alternatives: {
      type: "integer",
      label: "Alternatives",
      description: "Maximum number of transcript alternatives to return",
      optional: true,
    },
    numerals: {
      type: "boolean",
      label: "Numerals",
      description: "Indicates whether to convert numbers from written format (e.g., one) to numerical format (e.g., 1).",
      optional: true,
    },
    search: {
      type: "string[]",
      label: "Search",
      description: "Terms or phrases to search for in the submitted audio",
      optional: true,
    },
    replace: {
      type: "string[]",
      label: "Replace",
      description: "Terms or phrases to search for in the submitted audio and replace.",
      optional: true,
    },
    callback: {
      type: "string",
      label: "Callback",
      description: "Callback URL to provide if you would like your submitted audio to be processed asynchronously",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to which the model should pay particular attention to boosting or suppressing to help it understand context",
      optional: true,
    },
    paragraph: {
      type: "boolean",
      label: "Paragraph",
      description: "Indicates whether Deepgram will split audio into paragraphs to improve transcript readability. When paragraphs is set to `true`, you must also set either `punctuate`, `diarize`, or `multichannel` to `true`.",
      optional: true,
    },
    summarize: {
      type: "boolean",
      label: "Summarize",
      description: "Indicates whether Deepgram will provide summaries for sections of content. When `summarize` is set to `true`, `punctuate` will be set to `true` by default.",
      optional: true,
    },
    detectTopics: {
      type: "boolean",
      label: "Detect Topics",
      description: "Indicates whether Deepgram will identify and extract key topics for sections of content. When `detect_topics` is set to `true`, `punctuate` will be set to `true` by default.",
      optional: true,
    },
    detectEntities: {
      type: "boolean",
      label: "Detect Entities",
      description: "Indicates whether Deepgram will identify and extract key entities for sections of content. When `detect_entities` is set to `true`, `punctuate` will be set to true by default.",
      optional: true,
    },
    utterances: {
      type: "boolean",
      label: "Utterances",
      description: "Indicates whether Deepgram will segment speech into meaningful semantic units, which allows the model to interact more naturally and effectively with speakers’ spontaneous speech patterns",
      optional: true,
    },
    uttSplit: {
      type: "string",
      label: "Utt Split",
      description: "Length of time in seconds of silence between words that Deepgram will use when determining where to split utterances. Used when utterances is enabled.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Tag to associate with the request",
      optional: true,
    },
    callbackWithSuspend: {
      type: "boolean",
      label: "Callback with Suspend",
      description: "Use the `$.flow.suspend` Node.js helper to suspend the workflow until the transcription is completed. Overrides the `callback` parameter to Deepgram.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.url && !this.filePath) {
      throw new ConfigurationError("Either URL or File Path must be provided.");
    }

    let callback  = this.callback;
    if (this.callbackWithSuspend) {
      ({ resume_url: callback } = $.flow.suspend());
    }

    const params = {
      tier: this.tier,
      model: this.model,
      version: this.version,
      language: this.language,
      detect_language: this.detectLanguage,
      punctuate: this.punctuate,
      profanity_filter: this.profanityFilter,
      redact: this.redact,
      diarize: this.diarize,
      diarize_version: this.diarizeVersion,
      smart_format: this.smartFormat,
      multi_channel: this.multiChannel,
      alternatives: this.alternatives,
      numerals: this.numerals,
      search: this.search,
      replace: this.replace,
      callback,
      keywords: this.keywords,
      paragraph: this.paragraph,
      summarize: this.summarize,
      detect_topics: this.detectTopics,
      detect_entities: this.detectEntities,
      utterances: this.utterances,
      utt_split: this.uttSplit,
      tag: this.tag,
    };

    const config = {
      params,
      $,
    };

    if (this.url) {
      config.data = {
        url: this.url,
      };
    }
    if (this.filePath) {
      config.data = fs.readFileSync(this.filePath.includes("tmp/")
        ? this.filePath
        : `/tmp/${this.filePath}`);
      config.headers = {
        "Content-Type": "application/octet-stream",
      };
    }

    const response = await this.deepgram.transcribeAudio(config);

    if (response) {
      $.export("$summary", "Successfully transcribed audio");
    }

    return response;
  },
};
