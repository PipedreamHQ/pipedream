import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "ipgeolocation_io",
  props: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your IPGeolocation.io API key.",
      secret: true,
    },
  },
  propDefinitions: {
    lang: {
      type: "string",
      label: "Language",
      description: "Language for the response. Defaults to English. Only available on paid plans",
      optional: true,
      options: [
        {
          label: "English",
          value: "en",
        },
        {
          label: "German",
          value: "de",
        },
        {
          label: "Russian",
          value: "ru",
        },
        {
          label: "Japanese",
          value: "ja",
        },
        {
          label: "French",
          value: "fr",
        },
        {
          label: "Chinese Simplified",
          value: "cn",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "Czech",
          value: "cs",
        },
        {
          label: "Italian",
          value: "it",
        },
        {
          label: "Korean",
          value: "ko",
        },
        {
          label: "Persian",
          value: "fa",
        },
        {
          label: "Portuguese",
          value: "pt",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ipgeolocation.io/v3";
    },
    _apiKey() {
      return this.$auth.apiKey;
    },
    _makeRequest({
      $ = this,
      path,
      method = "GET",
      params = {},
      data,
      headers = {},
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        params: {
          apiKey: this._apiKey(),
          ...params,
        },
        data,
        ...opts,
      });
    },
  },
};
