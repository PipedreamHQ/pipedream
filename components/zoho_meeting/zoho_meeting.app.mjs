import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_meeting",
  propDefinitions: {},
  methods: {
    _baseApiUri() {
      return this.$auth.base_api_uri;
    },
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://meeting.${this._baseApiUri()}/api/v2`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Zoho-oauthtoken ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    async getMe(args = {}) {
      return this._makeRequest({
        path: "/user.json",
        ...args,
      });
    },
    async getMeetings(args = {}) {
      const { userDetails: me } = await this.getMe();

      return this._makeRequest({
        path: `/${me.zsoid}/sessions.json`,
        ...args,
      });
    },
    async createMeeting(args = {}) {
      const { userDetails: me } = await this.getMe();

      return this._makeRequest({
        path: `/${me.zsoid}/sessions.json`,
        method: "post",
        ...args,
        data: {
          ...args.data,
          session: {
            presenter: me.zuid,
            ...args.data.session,
          },
        },
      });
    },
    async getWebinars(args = {}) {
      const { userDetails: me } = await this.getMe();

      return this._makeRequest({
        path: `/${me.zsoid}/webinar.json`,
        ...args,
      });
    },
    async createWebinar(args = {}) {
      const { userDetails: me } = await this.getMe();

      return this._makeRequest({
        path: `/${me.zsoid}/webinar.json`,
        method: "post",
        ...args,
        data: {
          ...args.data,
          session: {
            presenter: me.zuid,
            ...args.data.session,
          },
        },
      });
    },
  },
};
