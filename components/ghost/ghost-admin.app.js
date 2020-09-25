const axios = require("axios");
const jwt = require("jsonwebtoken");

module.exports = {
  type: "app",
  app: "ghost_org_admin_api",
  methods: {
    async _getBaseURL() {
      return `${this.$auth.admin_api_url}ghost/api/v3/admin`;
    },
    async _getHeader(token) {
      return {
        Authorization: `Ghost ${token}`,
      };
    },
    async _getToken() {
      const key = this.$auth.admin_api_key;
      const [id, secret] = key.split(":");
      return jwt.sign({}, Buffer.from(secret, "hex"), {
        keyid: id,
        algorithm: "HS256",
        expiresIn: "5m",
        audience: `/v3/admin/`,
      });
    },
    async createHook(token, data) {
      const config = {
        method: "post",
        url: `${await this._getBaseURL()}/webhooks`,
        headers: await this._getHeader(token),
        data,
      };
      try {
        return await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteHook(hookId, token) {
      const config = {
        method: "delete",
        url: `${await this._getBaseURL()}/webhooks/${hookId}`,
        headers: await this._getHeader(token),
      };
      try {
        await axios(config);
      } catch (err) {
        console.log(err);
      }
    },
  },
};