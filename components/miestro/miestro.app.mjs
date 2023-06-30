import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "miestro",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Related user ID",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getUsers,
          page: page + 1,
          resourceKey: "data",
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "Related course ID",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getCourses,
          page: page + 1,
          resourceKey: "data",
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.miestro.com/api/v1.0${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        "X-Forward-Api-Key": this.$auth.api_key,
        "X-Forward-Api-Secret": this.$auth.api_secret,
        ...headers,
      };
    },
    async _makeRequest({
      $, path, params, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        params: {
          apikey: this.$auth.api_key,
          ...params,
        },
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getCourses(args = {}) {
      return this._makeRequest({
        path: "/courses",
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    async enrollUserToCourse({
      userId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/users/${userId}/enroll`,
        method: "POST",
        ...args,
      });
    },
    async unrollUserToCourse({
      userId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/users/${userId}/unroll`,
        method: "POST",
        ...args,
      });
    },
  },
};
