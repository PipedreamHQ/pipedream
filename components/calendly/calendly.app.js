const axios = require("axios");

module.exports = {
  type: "app",
  app: "calendly",
  methods: {
    _getHeader() {
      return {
        "X-TOKEN": this.$auth.api_key,
      };
    },
    _getBaseURL() {
      return "https://calendly.com/api/v1"
    },
    async getEventTypes() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/event_types`, {
          headers: this._getHeader(),
        })
      ).data.data;
    },
    async getEvents() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/events`, {
          headers: this._getHeader(),
        })
      ).data.data;
    },
    async createHook(data) {
      const config = {
        method: "post",
        url: `${this._getBaseURL()}/hooks`,
        headers: this._getHeader(),
        data,
      };
      return (await axios(config));
    },
    async deleteHook(hookId) {
      const config = {
        method: "delete",
        url: `${this._getBaseURL()}/hooks/${hookId}`,
        headers: this._getHeader(),
      };
      await axios(config);
    },
  },
};