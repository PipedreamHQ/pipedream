import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttextify",
  propDefinitions: {
    async: {
      type: "boolean",
      label: "Async",
      description: "whether to add the image in the background or immediately (synchronously). If async is set to true, the API response will always be successful with an empty response body.",
      default: false,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The language for the alt text. Supported language codes are accepted. If not provided, the account's default language is used.",
      default: "en",
    },
    maxChars: {
      type: "integer",
      label: "Max Characters",
      description: "Maximum length of the generated alt text.",
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The unique identifier for the asset.",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "List of keywords/phrases for SEO-optimized alt text. Only one or two will be used per alt text, but all are considered. Keywords must be in English, even for alt text in other languages.",
      optional: true,
    },
    ecommerceRunOCR: {
      type: "boolean",
      label: "Ecommerce Run OCR",
      description: "Flag to indicate if OCR should be run on the product.",
    },
    ecommerceProductName: {
      type: "string",
      label: "Ecommerce Product Name",
      description: "The name of the product in the image.",
      optional: true,
    },
    ecommerceProductBrand: {
      type: "string",
      label: "Ecommerce Product Brand",
      description: "The brand of the product in the image.",
      optional: true,
    },
    ecommerceProductColor: {
      type: "string",
      label: "Ecommerce Product Color",
      description: "The color of the product in the image.",
      optional: true,
    },
    ecommerceProductSize: {
      type: "string",
      label: "Ecommerce Product Size",
      description: "The size of the product in the image.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.alttextify.net/api/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
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
    uploadImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/raw",
        ...opts,
      });
    },
    uploadImageFromUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/url",
        ...opts,
      });
    },
    deleteAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    retrieveAltTextByJobId({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/image/job/${jobId}`,
        ...opts,
      });
    },
    retrieveAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    listAltTexts({ ...opts }) {
      return this._makeRequest({
        path: "/image",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;
      } while (hasMore);
    },
  },
};
