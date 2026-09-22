import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "visibot",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "Language code (ISO-639-1) for subtitles (e.g. `en`, `es`, `fr`)",
      optional: true,
      options: [
        "en",
        "es",
        "fr",
      ],
    },
    resizeForSocialMedia: {
      type: "boolean",
      label: "Resize for Social Media",
      description: "Resize the video to 9:16 vertical format for social media",
      optional: true,
    },
    captionsFontColor: {
      type: "string",
      label: "Captions Font Color",
      description: "Caption font color as a hex code (e.g. `#FF5733`)",
      optional: true,
    },
    captionsHighlightColor: {
      type: "string",
      label: "Captions Highlight Color",
      description: "Highlight color for spoken words as a hex code (e.g. `#FF5733`)",
      optional: true,
    },
    captionsOutlineColor: {
      type: "string",
      label: "Captions Outline Color",
      description: "Caption outline color as a hex code (e.g. `#FF5733`)",
      optional: true,
    },
    captionsPosition: {
      type: "string",
      label: "Captions Position",
      description: "Position of the captions. Use `top`, `middle`, `bottom`, or a value between `0.1` and `0.9`",
      options: [
        "top",
        "middle",
        "bottom",
      ],
      optional: true,
    },
    captionsFontSize: {
      type: "integer",
      label: "Captions Font Size",
      description: "Font size for captions, between `18` and `65`",
      min: 18,
      max: 65,
      optional: true,
    },
    captionsFontFamily: {
      type: "string",
      label: "Captions Font Family",
      description: "Font family for captions",
      options: [
        "Sigmar",
        "THEBOLDFONT",
        "Rubik",
      ],
      optional: true,
    },
    captionsAddEmojis: {
      type: "boolean",
      label: "Add Emojis to Captions",
      description: "Whether to add emojis to captions",
      optional: true,
    },
    captionsOutlineThickness: {
      type: "integer",
      label: "Captions Outline Thickness",
      description: "Thickness of the caption outline, between `0` and `20`",
      min: 0,
      max: 20,
      optional: true,
    },
    callback: {
      type: "string",
      label: "Callback URL",
      description: "URL to notify when video processing is complete",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.visibot.app";
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.auth_key}`,
        accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    createVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/video/create",
        ...opts,
      });
    },
    getVideoStatus(opts = {}) {
      return this._makeRequest({
        path: "/video/get",
        ...opts,
      });
    },
  },
};
