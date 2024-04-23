import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gan_ai",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the user's project in the GAN AI systems.",
      async options() {
        const { data } = await this.getProjects();
        return data.map(({
          project_id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.gan.ai${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects/v2",
        ...args,
      });
    },
  },
};
