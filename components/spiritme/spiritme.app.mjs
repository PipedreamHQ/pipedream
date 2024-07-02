import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "spiritme",
  propDefinitions: {
    avatar: {
      type: "string",
      label: "Avatar",
      description: "The identifier for the avatar to be used. One of avatar or media is required.",
      optional: true,
      async options({ page }) {
        const { results } = await this.listAvatars({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    voice: {
      type: "string",
      label: "Voice",
      description: "The identifier of the voice to be used",
      optional: true,
      async options({ page }) {
        const { results } = await this.listVoices({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    file: {
      type: "string",
      label: "Voice",
      description: "The identifier of the file to be used",
      optional: true,
      async options({
        page, type,
      }) {
        const { results } = await this.listFiles({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
            type,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.spiritme.tech/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Token ${this.$auth.api_key}`,
          Accept: "application/json",
        },
      });
    },
    listAvatars(opts = {}) {
      return this._makeRequest({
        path: "/avatars/",
        ...opts,
      });
    },
    listVoices(opts = {}) {
      return this._makeRequest({
        path: "/tts/voices/",
        ...opts,
      });
    },
    listFiles(opts = {}) {
      return this._makeRequest({
        path: "/files/",
        ...opts,
      });
    },
    listVideos(opts = {}) {
      return this._makeRequest({
        path: "/videos/",
        ...opts,
      });
    },
    getVideo({
      videoId, ...opts
    }) {
      return this._makeRequest({
        path: `/videos/${videoId}/`,
        ...opts,
      });
    },
    generateVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/videos/",
        ...opts,
      });
    },
  },
};
