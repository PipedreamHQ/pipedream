import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deepimage",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.jpg`).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://deep-image.ai/rest_api/process_result";
    },
    _headers() {
      return {
        "content-type": "application/json",
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
  },
};
