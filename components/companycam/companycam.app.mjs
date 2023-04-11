import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "companycam",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      async options({
        page, query,
      }) {
        const projects = await this.listProjects({
          params: {
            page,
            per_page: constants.DEFAULT_LIMIT,
            query,
          },
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    coordinateLat: {
      type: "string",
      label: "Coordinate Latitude",
      description: "The latitude of the project.",
      optional: true,
    },
    coordinateLon: {
      type: "string",
      label: "Coordinate Longitude",
      description: "The longitude of the project.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    createProject(args = {}) {
      return this.create({
        path: "/projects",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        path: "/projects",
        ...args,
      });
    },
  },
};
