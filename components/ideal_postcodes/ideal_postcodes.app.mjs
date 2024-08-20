import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ideal_postcodes",
  propDefinitions: {
    tags: {
      type: "string",
      label: "Tags",
      description: "A comma separated list of tags to query over. Useful if you want to specify the circumstances in which the request was made. If multiple tags are specified, the response will only comprise of requests for which all the tags are satisfied - i.e. searching `foo,bar` will only query requests which tagged both `foo` and `bar`.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.ideal-postcodes.co.uk/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `api_key="${this.$auth.api_key}"`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
  },
};
