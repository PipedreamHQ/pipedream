import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bouncer",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.usebouncer.com/v1.1";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "x-api-key": this._apiKey(),
        },
      });
    },
    verifyEmail(args = {}) {
      return this._makeRequest({
        path: "/email/verify",
        ...args,
      });
    },
    async verifyEmailBatch(args = {}) {
      const { batchId } = await this._makeRequest({
        path: "/email/verify/batch",
        method: "post",
        ...args,
      });

      let response;

      while (!response) {
        try {
          response = await this._makeRequest({
            path: `/email/verify/batch/${batchId}/download`,
          });
        } catch (error) {
          console.log("Batch is not ready yet, searching again...");
        }

        await new Promise((res) => setTimeout(res, 1000));
      }

      return response;
    },
  },
};
