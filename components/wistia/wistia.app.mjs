import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wistia",
  propDefinitions: {
    projectId: {
      label: "Project ID",
      description: "The ID of the project",
      type: "string",
      async options({ page }) {
        const projects = await this.getProjects({
          params: {
            per_page: 100,
            page,
          },
        });

        return projects.map((project) => ({
          label: project.name,
          value: project.hashedId,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.wistia.com/v1";
    },
    _uploadApiUrl() {
      return "https://upload.wistia.com";
    },
    _encodeDataToFormUrl(obj) {
      return Object.keys(obj).reduce((p, c) => p + `&${c}=${encodeURIComponent(obj[c])}`, "");
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: "api",
          password: this._apiToken(),
        },
        ...args,
      });
    },
    async getMedias({ ...args } = {}) {
      return this._makeRequest({
        path: "/medias.json",
        ...args,
      });
    },
    async getProjects({ ...args } = {}) {
      return this._makeRequest({
        path: "/projects.json",
        ...args,
      });
    },
    async getVisitors({ ...args } = {}) {
      return this._makeRequest({
        path: "/stats/visitors.json",
        ...args,
      });
    },
    async getViewingSessions({ ...args } = {}) {
      return this._makeRequest({
        path: "/stats/events.json",
        ...args,
      });
    },
    async uploadMedia({ ...args } = {}) {
      return this._makeRequest({
        url: this._uploadApiUrl(),
        method: "post",
        ...args,
        data: this._encodeDataToFormUrl({
          ...args.data,
          api_password: this._apiToken(),
        }),
      });
    },
  },
};
