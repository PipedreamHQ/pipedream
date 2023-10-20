const axios = require("axios");

module.exports = {
  type: "app",
  app: "calendly",
  methods: {
    _getAuthHeader() {
      return {
        "X-TOKEN": this.$auth.api_key,
      };
    },
    _getBaseURL() {
      return "https://calendly.com/api/v1";
    },
    monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return Date.parse(monthAgo);
    },
    async getEventTypes() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/event_types`, {
          headers: this._getAuthHeader(),
        })
      ).data.data;
    },
    async getEvents() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/events`, {
          headers: this._getAuthHeader(),
        })
      ).data.data;
    },
    async createHook(data) {
      const config = {
        method: "post",
        url: `${this._getBaseURL()}/hooks`,
        headers: this._getAuthHeader(),
        data,
      };
      return await axios(config);
    },
    async deleteHook(hookId) {
      const config = {
        method: "delete",
        url: `${this._getBaseURL()}/hooks/${hookId}`,
        headers: this._getAuthHeader(),
      };
      await axios(config);
    },
  },
};
