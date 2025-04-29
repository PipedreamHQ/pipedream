import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "learnworlds",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User Id",
      description: "Unique identifier of the used.",
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, username: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.school_domain}/admin/api/v2`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Lw-Client": `${this.$auth.oauth_client_id}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    enrollUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/enrollment`,
        ...opts,
      });
    },
    getBundle({ productId }) {
      return this._makeRequest({
        path: `/bundles/${productId}`,
      });
    },
    getCourse({ productId }) {
      return this._makeRequest({
        path: `/courses/${productId}`,
      });
    },
    getSubscription({ productId }) {
      return this._makeRequest({
        path: `/subscription-plans/${productId}`,
      });
    },
    listBundles(opts = {}) {
      return this._makeRequest({
        path: "/bundles",
        ...opts,
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/courses",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscription-plans",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
  },
};
