import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "knorish",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
      async options({ page }) {
        return this.asyncOptions({
          page,
          fn: this.listCourses,
        });
      },
    },
    bundleId: {
      type: "string",
      label: "Bundle Id",
      description: "The id of the bundle.",
      async options({ page }) {
        return this.asyncOptions({
          page,
          fn: this.listBundles,
        });
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ page }) {
        return this.asyncOptions({
          page,
          fn: this.listUsers,
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.knorish.com/publisher/v1.0";
    },
    _getHeaders() {
      return {
        "x-appid": this.$auth.app_id,
        "x-appkey": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    async asyncOptions({
      page, fn,
    }) {
      const { data } = await fn({
        params: {
          start: LIMIT * page,
          length: LIMIT,
        },
      });

      return data.map(({
        id: value, name: label,
      }) => ({
        label,
        value,
      }));
    },
    listBundles(opts = {}) {
      return this._makeRequest({
        path: "/bundle/GetBundles",
        ...opts,
      });
    },
    listBundleUsers(opts = {}) {
      return this._makeRequest({
        path: "/bundle/GetBundleUsers",
        ...opts,
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/course/GetCourses",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/user/GetUsers",
        ...opts,
      });
    },
    createUser( opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user/CreateUser",
        ...opts,
      });
    },
    addUserToCourse(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/user/AddUserInCourse",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.start = LIMIT * page;
        params.length = LIMIT;
        page++;

        const { data } = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
