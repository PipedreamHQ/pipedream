import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "listen_notes",
  propDefinitions: {
    id: {
      type: "string",
      label: "Podcast or Episode ID",
      description: "The ID of the podcast or episode",
      async options({
        q, type, language, offset,
      }) {
        const response = await this.listPodcasts({
          q,
          type,
          language,
          offset,
        });
        const ids = response.results;
        return ids.map(({
          title_original, id,
        }) => ({
          value: id,
          label: title_original,
        }));
      },
    },
    q: {
      type: "string",
      label: "Query",
      description: "Search term, e.g., person, place, topic... You can use double quotes to do verbatim match",
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "The offset parameter is used to paginate through search results",
      optional: true,
    },
    sortByDate: {
      type: "string",
      label: "Sort By Date",
      description: "Sort by date. If 0, then sort by relevance. If 1, then sort by date",
      options: constants.BOOLEAN_OPTIONS,
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "What type of contents do you want to search for?",
      options: constants.TYPE_OPTIONS,
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Limit search results to a specific language. If not specified, it'll be any language",
      async options() {
        const response = await this.getLanguages();
        const languages = response.languages;
        return languages.map((language) => ({
          value: language,
          label: language,
        }));
      },
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://listen-api.listennotes.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-ListenAPI-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async fullSearch(args = {}) {
      return this._makeRequest({
        path: "/search",
        ...args,
      });
    },
    async getPodcastDetails({
      id,
      ...args
    }) {
      return this._makeRequest({
        path: `/podcasts/${id}`,
        ...args,
      });
    },
    async getEpisodeDetails({
      id,
      ...args
    }) {
      return this._makeRequest({
        path: `/episodes/${id}`,
        ...args,
      });
    },
    async listPodcasts({
      q,
      language,
      type,
      offset,
      ...args
    }) {
      return this._makeRequest({
        path: "/search",
        params: {
          q: q,
          type: type,
          language: language,
          offset: offset,
        },
        ...args,
      });
    },
    async getLanguages(args = {}) {
      return this._makeRequest({
        path: "/languages",
        ...args,
      });
    },
  },
};
