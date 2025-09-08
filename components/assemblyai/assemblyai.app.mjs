import { axios } from "@pipedream/platform";
import {
  LANGUAGE_CODE_OPTIONS, SUBTITLE_FORMAT_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "assemblyai",
  propDefinitions: {
    transcriptId: {
      type: "string",
      label: "Transcript",
      description: "Identifier of a transcript",
      async options({ prevContext }) {
        const config = {};
        if (prevContext?.prevUrl) {
          config.url = prevContext.prevUrl;
        }
        const {
          transcripts, page_details: pageDetails,
        } = await this.listTranscripts(config);
        const options = transcripts.map(({ id }) => id );
        return {
          options,
          context: {
            prevUrl: pageDetails?.prev_url,
          },
        };
      },
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language of your audio file. The default value is `en_us`.",
      options: LANGUAGE_CODE_OPTIONS,
      default: "en_us",
      optional: true,
    },
    subtitleFormat: {
      type: "string",
      label: "Subtitle Format",
      description: "Format used for subtitles or closed captioning",
      options: SUBTITLE_FORMAT_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.assemblyai.com/v2";
    },
    _headers() {
      return {
        "authorization": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getTranscript({
      transcriptId, ...args
    }) {
      return this._makeRequest({
        path: `/transcript/${transcriptId}`,
        ...args,
      });
    },
    listTranscripts(args = {}) {
      return this._makeRequest({
        path: "/transcript",
        ...args,
      });
    },
    createTranscript(args = {}) {
      return this._makeRequest({
        path: "/transcript",
        method: "POST",
        ...args,
      });
    },
    createCaptions({
      transcriptId, format, ...args
    }) {
      return this._makeRequest({
        path: `/transcript/${transcriptId}/${format}`,
        ...args,
      });
    },
    async paginateTranscripts(args = {}) {
      const config = {
        ...args,
      };
      let prevUrl;
      const results = [];

      do {
        const {
          transcripts, page_details: pageDetails,
        } = await this.listTranscripts(config);
        results.push(...transcripts);
        prevUrl = pageDetails.prev_url;
        config.url = prevUrl;
      } while (prevUrl);

      return results;
    },
  },
};
