import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "hamsa",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job Id",
      description: "The ID of the job you want to use.",
      async options({ page }) {
        const { data: { jobs } } = await this.listJobs({
          params: {
            take: LIMIT,
            skip: page * LIMIT,
          },
        });

        return jobs.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "The voice ID for Text to Speech conversion.",
      async options({ page }) {
        const params = {
          take: LIMIT,
        };
        if (page) {
          params.skip = page * LIMIT;
        }
        const { data } = await this.listVoices({
          params,
        });

        return data.map(({
          id: value, name, tags,
        }) => ({
          label: `${name} (${tags.join(" - ")})`,
          value,
        }));
      },
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to receive the webhook notifications.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tryhamsa.com/v1";
    },
    _headers() {
      return {
        "authorization": `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    async listJobs({
      params, ...opts
    }) {
      const { data: { id: projectId } } = await this._makeRequest({
        path: "/projects/by-api-key",
        ...opts,
      });

      return this._makeRequest({
        method: "POST",
        path: "/jobs/all",
        params: {
          ...params,
          projectId,
        },
        ...opts,
      });
    },
    listVoices(opts = {}) {
      return this._makeRequest({
        path: "/tts/voices",
        ...opts,
      });
    },
    transcribeVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs/transcribe",
        ...opts,
      });
    },
    generateTTS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs/text-to-speech",
        ...opts,
      });
    },
    createAIContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/jobs/ai-content",
        ...opts,
      });
    },
  },
};
