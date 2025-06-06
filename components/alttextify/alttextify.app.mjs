import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alttextify",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to process for alt text generation",
    },
    imageType: {
      type: "string",
      label: "Image Type",
      description: "The type of the image (e.g., 'raw', 'url')",
      options: [
        "raw",
        "url",
      ],
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job for generating or retrieving alt text",
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset for retrieving or deleting alt text.",
    },
    lang: {
      type: "string",
      label: "Language",
      description: "The language code for the generated alt text.",
    },
    maxChars: {
      type: "integer",
      label: "Max Characters",
      description: "The maximum length of the generated alt text.",
    },
    asyncOption: {
      type: "boolean",
      label: "Async",
      description: "Determine whether to process the image asynchronously.",
      default: false,
    },
    imageSubmissionId: {
      type: "string",
      label: "Image Submission ID",
      description: "The ID of the image submission for monitoring events.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.alttextify.net/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async uploadImageUrl({
      imageUrl, imageType, lang, maxChars, asyncOption, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/image/${imageType}`,
        data: {
          image: imageUrl,
          lang,
          max_chars: maxChars,
          async: asyncOption,
        },
        ...opts,
      });
    },
    async retrieveAltTextByJobId({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/image/job/${jobId}`,
        ...opts,
      });
    },
    async retrieveAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    async deleteAltTextByAssetId({
      assetId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/image/${assetId}`,
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          params: {
            page,
            ...opts,
          },
        });
        results = results.concat(response);
        hasMore = response.length > 0; // Assume if response has 0 items, it's the end
        page++;
      }
      return results;
    },
    async emitNewAltTextGeneratedEvent(imageSubmissionId) {
      // Example method to handle emitting events when new alt text is generated
      // This method would be used in an event source component
    },
    async emitImageProcessingFailedEvent(imageSubmissionId) {
      // Example method to handle emitting events when image processing fails
      // This method would be used in an event source component
    },
  },
};
