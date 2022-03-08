import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "symbl_ai",
  propDefinitions: {},
  methods: {
    getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        path,
        url,
        ...otherConfig
      } = customConfig;

      const basePath = "https://api.symbl.ai/v1";

      const config = {
        url: url ?? `${basePath}${path}`,
        headers: this.getHeaders(),
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async postVideoUrl({
      $,
      data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/process/video/url",
        data,
      });
    },
    async getJobStatus({
      $,
      jobId,
    }) {
      return this.makeRequest({
        $,
        path: `/job/${jobId}`,
      });
    },
  },
};
