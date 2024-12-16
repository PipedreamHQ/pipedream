import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gistly",
  propDefinitions: {
    videoUrl: {
      type: "string",
      label: "YouTube Video URL",
      description: "The URL of the YouTube video to fetch the transcript from",
    },
    videoId: {
      type: "string",
      label: "YouTube Video ID",
      description: "The ID of the YouTube video to fetch the transcript from",
    },
    text: {
      type: "boolean",
      label: "Plain Text",
      description: "Return plain text transcript",
      default: false,
    },
    chunkSize: {
      type: "integer",
      label: "Chunk Size",
      description: "Maximum characters per transcript chunk",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.gist.ly";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          "x-api-key": this._apiKey(),
          "Content-Type": "application/json",
        },
      });
    },
    getTranscript(args = {}) {
      return this._makeRequest({
        path: "/youtube/transcript",
        ...args,
      });
    },
  },
};
