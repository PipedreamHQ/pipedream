const axios = require("axios");

module.exports = {
  type: "app",
  app: "intercom",
  methods: {
    _getBaseURL() {
      return "https://api.intercom.io";
    },
    _getHeader() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        Accept: "application/json",
      };
    },
    monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async searchContacts(data, starting_after = null) {
      config = {
        method: "POST",
        url: `${this._getBaseURL()}/contacts/search${
          starting_after ? "?starting_after=" + starting_after : ""
        }`,
        headers: this._getHeader(),
        data,
      };
      return await axios(config);
    },
    async getConversation(id) {
      config = {
        method: "GET",
        url: `${this._getBaseURL()}/conversations/${id}`,
        headers: this._getHeader(),
      };
      return await axios(config);
    },
    async searchConversations(data, starting_after = null) {
      config = {
        method: "POST",
        url: `${this._getBaseURL()}/conversations/search${
          starting_after ? "?starting_after=" + starting_after : ""
        }`,
        headers: this._getHeader(),
        data,
      };
      return await axios(config);
    },
    async getEvents(user_id, nextURL = null) {
      let url =
        nextURL ||
        `${this._getBaseURL()}/events?type=user&intercom_user_id=${user_id}`;
      config = {
        method: "GET",
        url,
        headers: this._getHeader(),
      };
      return await axios(config);
    },
    async getCompanies(starting_after = null) {
      config = {
        method: "GET",
        url: `${this._getBaseURL()}/companies${
          starting_after ? "?starting_after=" + starting_after : ""
        }`,
        headers: this._getHeader(),
      };
      return await axios(config);
    },
  },
};