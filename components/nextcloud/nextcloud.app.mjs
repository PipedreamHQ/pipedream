import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nextcloud",
  propDefinitions: {
    shareId: {
      type: "string",
      label: "Share ID",
      description: "The identifier of a share",
      async options() {
        const { ocs: { data } } = await this.listShares();
        return data?.map(({
          id: value, path: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    path: {
      type: "string",
      label: "Path",
      description: "Get shares for a specific path",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}/ocs/v2.php/apps/files_sharing/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,

        url: `${this._baseUrl()}${path}`,
        headers: {
          "OCS-APIRequest": "true",
        },
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.password}`,
        },
      });
    },
    listShares(opts = {}) {
      return this._makeRequest({
        path: "/shares",
        ...opts,
      });
    },
    createShare(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/shares",
        ...opts,
      });
    },
    deleteShare({
      shareId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/shares/${shareId}`,
        ...opts,
      });
    },
  },
};
