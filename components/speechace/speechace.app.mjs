import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "speechace",
  propDefinitions: {
    audioFile: {
      type: "string",
      label: "Audio File",
      description: "The audio file to be transcribed and scored. It should be a URL to the file",
    },
    textScript: {
      type: "string",
      label: "Text Script",
      description: "The text script for scoring the audio file based on fluency and pronunciation",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.speechace.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async transcribeAndScore(audioFile) {
      return this._makeRequest({
        path: "/v1/speech/grade/file",
        data: {
          audio: audioFile,
        },
      });
    },
    async scoreScript(audioFile, textScript) {
      return this._makeRequest({
        path: "/v1/speech/grade/text",
        data: {
          audio: audioFile,
          text: textScript,
        },
      });
    },
  },
};
