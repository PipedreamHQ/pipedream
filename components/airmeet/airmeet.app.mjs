import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airmeet",
  propDefinitions: {
    airmeetId: {
      type: "string",
      label: "Airmeet ID",
      description: "The Airmeet ID",
      async options() {
        const { data: airmeets } = await this.getAirmeets();

        return airmeets.map((airmeet) => ({
          value: airmeet.uid,
          label: airmeet.name,
        }));
      },
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _region() {
      return this.$auth.region;
    },
    _apiUrl() {
      return `https://${this._region()}.airmeet.com/prod`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "X-Airmeet-Access-Token": this._oauthAccessToken(),
        },
      });
    },
    createAirmeet(args = {}) {
      return this._makeRequest({
        path: "/airmeet",
        method: "post",
        ...args,
      });
    },
    addAuthorizedAttendee({
      airmeetId, ...args
    }) {
      return this._makeRequest({
        path: `/airmeet/${airmeetId}/attendee`,
        method: "post",
        ...args,
      });
    },
    getAirmeets(args = {}) {
      return this._makeRequest({
        path: "/airmeets",
        ...args,
      });
    },
  },
};
