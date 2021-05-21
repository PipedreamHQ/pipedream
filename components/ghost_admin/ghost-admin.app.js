const axios = require("axios");
const jwt = require("jsonwebtoken");

module.exports = {
  type: "app",
  app: "ghost_org_admin_api",
  methods: {
    _getBaseURL() {
      return `${this.$auth.admin_api_url}ghost/api/v3/admin`;
    },
    _getHeader(token) {
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
        url: `${this._getBaseURL()}/webhooks`,
        headers: this._getHeader(token),
        data,
      };
      return await axios(config);
    },
    async deleteHook(hookId, token) {
      const config = {
        method: "delete",
        url: `${this._getBaseURL()}/webhooks/${hookId}`,
        headers: this._getHeader(token),
      };
      await axios(config);
    },
  },
};