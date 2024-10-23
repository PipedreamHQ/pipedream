import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deepimage",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image",
      description: "The URL of the image or the path to the file saved to the `/tmp` directory  (e.g. `/tmp/example.jpg`)  to process. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
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
