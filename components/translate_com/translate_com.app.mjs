import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "translate_com",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "A language",
      async options() {
        const languages = await this.getLanguages();

        return languages.map((language) => ({
          value: language.code,
          label: language.name,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://translation-api.translate.com/translate/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "x-api-key": this._apiKey(),
        },
      });
    },
    translateText(args = {}) {
      return this._makeRequest({
        path: "/mt",
        method: "post",
        ...args,
      });
    },
    getLanguages(args = {}) {
      return this._makeRequest({
        path: "/mt-langs",
        ...args,
      });
    },
  },
};
