import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttext_ai",
  propDefinitions: {
    imageData: {
      type: "string",
      label: "Image Data",
      description: "The image data in base64 encoding or as a URL to the image.",
      optional: false,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language to use for the alt text. Defaults to English (en).",
      options: [
        {
          label: "English",
          value: "en",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "French",
          value: "fr",
        },
        // Add more languages as needed
      ],
      optional: true,
      default: "en",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.alttext.org/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async generateAltText({
      imageData, language,
    }) {
      return this._makeRequest({
        path: "/generate",
        data: {
          image: imageData,
          language,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
