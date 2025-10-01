import deepgram from "../../deepgram.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "deepgram-transcribe-audio",
  name: "Transcribe Audio",
  description: "Transcribes the specified audio file. [See the documentation](https://developers.deepgram.com/api-reference/transcription/#transcribe-pre-recorded-audio)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deepgram,
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.mp3`)",
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
      description: "Indicates whether Deepgram will segment speech into meaningful semantic units, which allows the model to interact more naturally and effectively with speakers' spontaneous speech patterns",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    let callback = this.callback;
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

    // Check if the file is a URL
    if (this.file.startsWith("http://") || this.file.startsWith("https://")) {
      config.data = {
        url: this.file,
      };
    } else {
      const {
        stream,
        metadata,
      } = await getFileStreamAndMetadata(this.file);
      const fileBuffer = await this.streamToBuffer(stream);
      config.data = fileBuffer;
      config.headers = {
        "Content-Type": metadata.contentType || "application/octet-stream",
      };
    }

    const response = await this.deepgram.transcribeAudio(config);

    if (response) {
      $.export("$summary", "Successfully transcribed audio");
    }

    return response;
  },
};
