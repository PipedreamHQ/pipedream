import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hootsuite",
  propDefinitions: {
    socialProfileIds: {
      type: "string[]",
      label: "Social Profile IDs",
      description: "The social profiles that the message will be posted to.",
      async options() {
        const { data } = await this.listSocialProfiles();
        return data.map(({
          id: value, socialNetworkUsername: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://platform.hootsuite.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, noHeaders = false, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: noHeaders
          ? {}
          : this._headers(),
        ...opts,
      });
    },
    listSocialProfiles(opts = {}) {
      return this._makeRequest({
        path: "/socialProfiles",
        ...opts,
      });
    },
    getMediaUploadStatus({
      fileId, ...opts
    }) {
      return this._makeRequest({
        path: `/media/${fileId}`,
        ...opts,
      });
    },
    scheduleMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    getPosts(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
  },
};
