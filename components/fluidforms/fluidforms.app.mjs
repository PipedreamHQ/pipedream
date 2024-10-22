import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fluidforms",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://fluidforms.co";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getSubmissions() {
      return this._makeRequest({
        path: "/api/zapier/forms/submissions",
      });
    },
  },
  async run() {
    const submissions = await this.getSubmissions();
    submissions.forEach((submission) => {
      this.$emit(submission, {
        summary: `Received submission ${submission.id}`,
        id: submission.id,
        ts: Date.now(),
      });
    });
  },
};
