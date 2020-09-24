const axios = require("axios");

module.exports = {
  type: "app",
  app: "calendly",
  methods: {
    async _getHeader() {
      return {
        "X-TOKEN": this.$auth.api_key,
      };
    },
    async _getBaseURL() {
      return "https://calendly.com/api/v1"
    },
    async getEventTypes() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/event_types`, {
          headers: await this._getHeader(),
        })
      ).data.data;
    },
    async getEvents() {
      return (
        await axios.get(`${this._getBaseURL()}/users/me/events`, {
          headers: await this._getHeader(),
        })
      ).data.data;
    },
    async createHook(data) {
      const config = {
        method: "post",
        url: `${await this._getBaseURL()}/hooks`,
        headers: await this._getHeader(),
        data,
      };
      try {
        return (await axios(config));
      } catch (err) {
        console.log(err);
      }
    },
    async deleteHook(hookId) {
      const config = {
        method: "delete",
        url: `${await this._getBaseURL()}/hooks/${hookId}`,
        headers: await this._getHeader(),
      };
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
  },
};