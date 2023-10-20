import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "humor_api",
  propDefinitions: {
    includeTags: {
      type: "string[]",
      label: "Included Tags",
      description: "A comma-separated list of tags the jokes should have.",
      optional: true,
    },
    excludeTags: {
      type: "string[]",
      label: "Excluded Tags",
      description: "A comma-separated list of tags the jokes must not have.",
      optional: true,
    },
    maxLength: {
      type: "integer",
      label: "Maximum length",
      description: "The maximum length of the joke in letters.",
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "A comma-separated list of words that must occur in the joke.",
      optional: true,
    },
    keywordsInImage: {
      type: "boolean",
      label: "Keywords In Image",
      description: "Whether the keywords must occur in the image.",
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The media type (either 'image', 'video' or even specific format such as 'jpg', 'png', or 'gif').",
      optional: true,
      options: [
        "image",
        "video",
        "jpg",
        "png",
        "gif",
      ],
    },
    minRating: {
      type: "integer",
      label: "Minimum rating",
      description: "The minimum rating (0-10).",
      min: 0,
      max: 10,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of jokes to skip, between 0 and 1000.",
      min: 0,
      max: 1000,
      optional: true,
    },
    number: {
      type: "integer",
      label: "Number of jokes",
      description: "The number of jokes, between 0 and 10.",
      min: 0,
      max: 10,
      optional: true,
    },
  },
  methods: {
    getApiKey() {
      return this.$auth.api_key;
    },
    getBaseUrl(path) {
      const baseUrl = "https://api.humorapi.com";
      return `${baseUrl}${path}`;
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        path,
        params,
        ...otherConfig
      } = customConfig;

      const config = {
        url: this.getBaseUrl(path),
        params: {
          ...params,
          "api-key": this.getApiKey(),
        },
        ...otherConfig,
      };
      return axios($, config);
    },
    searchJokes(args = {}) {
      return this.makeRequest({
        path: "/jokes/search",
        ...args,
      });
    },
    randomJoke(args = {}) {
      return this.makeRequest({
        path: "/jokes/random",
        ...args,
      });
    },
    searchMemes(args = {}) {
      return this.makeRequest({
        path: "/memes/search",
        ...args,
      });
    },
    randomMeme(args = {}) {
      return this.makeRequest({
        path: "/memes/random",
        ...args,
      });
    },
    rateContent({
      kind,
      id,
      vote,
      ...args
    }) {
      return this.makeRequest({
        path: `/${kind}/${id}/${vote}`,
        ...args,
      });
    },
  },
};
