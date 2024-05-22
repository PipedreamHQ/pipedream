import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linguapop",
  propDefinitions: {
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The code of the language you want to test",
      async options() {
        const languages = await this.listLanguages();
        return languages.map(({
          code: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.linguapop.eu/api/actions";
    },
    _authParams(params) {
      return {
        ...params,
        apiKey: `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, params, data, ...otherOpts
      } = opts;
      const config = {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
      };
      if (params) {
        config.params = this._authParams(params);
      } else if (data) {
        config.data = this._authParams(data);
      }
      return axios($, config);
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/getLanguages",
        ...opts,
      });
    },
    createTestInvitation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendInvitation",
        ...opts,
      });
    },
  },
};
