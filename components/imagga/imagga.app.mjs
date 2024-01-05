import { axios } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "imagga",
  propDefinitions: {
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ticket ID to track the status of the image processing batch",
    },
    imageProcessType: {
      type: "string",
      label: "Image Process Type",
      description: "The type of image processing to perform.",
      options: [
        {
          label: "Tags",
          value: "tags",
        },
        {
          label: "Categories",
          value: "categories",
        },
        {
          label: "Colors",
          value: "colors",
        },
      ],
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to analyze.",
    },
    imageFile: {
      type: "string",
      label: "Image File",
      description: "The file path of the image to analyze.",
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The callback URL to be invoked after batch processing",
    },
    language: {
      type: "string[]",
      label: "Language",
      description: "Specify the languages you want to receive your results in.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
    saveIndex: {
      type: "string",
      label: "Save Index",
      description: "The index name in which you wish to save this image for searching later on.",
      optional: true,
    },
    saveId: {
      type: "string",
      label: "Save Id",
      description: "The id with which you wish to associate your image when putting it in a search index. This will be the identificator which will be returned to you when searching for similar images. (If you send an image with an already existing id, it will be overriden as if an update operation took place. Consider this when choosing your ids.)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.imagga.com/v2";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: `${this.$auth.api_secret}`,
      };
    },
    _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        auth: this._auth(),
        url: this._baseUrl() + path,
      });
    },
    analyzeImage({
      imageProcessType, ...opts
    }) {
      switch (imageProcessType) {
      case "tags" : return this.imageTagging(opts);
      case "categories" : return this.categorizeImage(opts);
      case "colors" : return this.analyzeImageColor(opts);
      }
    },
    getTicket({
      ticketId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/tickets/${ticketId}`,
        ...opts,
      });
    },
    imageTagging({
      taggerId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/tags${taggerId
          ? `/${taggerId}`
          : ""}`,
        ...opts,
      });
    },
    uploadImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/uploads",
        ...opts,
      });
    },

    listCategorizers() {
      return this._makeRequest({
        path: "/categorizers",
      });
    },
    analyzeImageColor(opts = {}) {
      return this._makeRequest({
        path: "/colors",
        ...opts,
      });
    },
    analyzeBatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches",
        ...opts,
      });
    },
    categorizeImage({
      categorizerId, ...opts
    }) {
      return this._makeRequest({
        path: `/categories/${categorizerId}`,
        ...opts,
      });
    },
  },
};
