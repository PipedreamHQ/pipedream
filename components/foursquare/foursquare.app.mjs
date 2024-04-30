import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "foursquare",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
    },
    venueId: {
      type: "string",
      label: "Venue ID",
      description: "The ID of the venue where the check-in or tip is made.",
    },
    geolocationScope: {
      type: "string",
      label: "Geolocation Scope",
      description: "A geolocation scope to track check-ins only in certain areas. (Optional)",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "A keyword to track tips about specific topics. (Optional)",
      optional: true,
    },
    shout: {
      type: "string",
      label: "Shout",
      description: "A message about your check-in. (Optional)",
      optional: true,
    },
    tipText: {
      type: "string",
      label: "Tip Text",
      description: "The text of the tip.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.foursquare.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCheckIn({
      venueId, shout,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/checkins/add",
        data: {
          venueId,
          shout,
        },
      });
    },
    async addTip({
      venueId, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/tips/add",
        data: {
          venueId,
          text,
        },
      });
    },
    async getUserTips({
      userId, limit, offset, categoryId, venueId,
    }) {
      return this._makeRequest({
        path: `/users/${userId || "self"}/tips`,
        params: {
          limit,
          offset,
          categoryId,
          venueId,
        },
      });
    },
    async getUserCheckins({
      userId, limit, offset,
    }) {
      return this._makeRequest({
        path: `/users/${userId || "self"}/checkins`,
        params: {
          limit,
          offset,
        },
      });
    },
  },
};
