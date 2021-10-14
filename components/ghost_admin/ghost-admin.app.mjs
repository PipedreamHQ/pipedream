import axios from "axios";
import jwt from "jsonwebtoken";
import lodash from "lodash";

export default {
  type: "app",
  app: "ghost_org_admin_api",
  methods: {
    _getBaseURL() {
      return `${this.$auth.admin_api_url}/ghost/api/v3/admin`;
    },
    _getHeader(token) {
      return {
        Authorization: `Ghost ${token}`,
      };
    },
    async _getToken() {
      const key = this.$auth.admin_api_key;
      const [
        id,
        secret,
      ] = key.split(":");
      return jwt.sign({}, Buffer.from(secret, "hex"), {
        keyid: id,
        algorithm: "HS256",
        expiresIn: "5m",
        audience: "/v3/admin/",
      });
    },
    async createHook(event, targetUrl) {
      const data = {
        webhooks: [
          {
            event,
            target_url: targetUrl,
          },
        ],
      };
      const token = await this._getToken();
      const res = await this.makeHttpCreateHookRequest(token, data);
      if (!lodash.get(res, "data.webhooks[0].id")) {
        throw new Error("No webhook id was returned by Ghost. Please try again.");
      }

      return {
        token,
        hookId: res.data.webhooks[0].id,
      };
    },
    async deleteHook(hookId, token) {
      if (!hookId || !token) {
        console.warn("No hookId or token provided. None webhook deleted", {
          hookId,
          token,
        });
      }
      await this.makeHttpDeleteHookRequest(hookId, token);
    },
    async makeHttpCreateHookRequest(token, data) {
      const config = {
        method: "post",
        url: `${this._getBaseURL()}/webhooks`,
        headers: this._getHeader(token),
        data,
      };
      return await axios(config);
    },
    async makeHttpDeleteHookRequest(hookId, token) {
      const config = {
        method: "delete",
        url: `${this._getBaseURL()}/webhooks/${hookId}`,
        headers: this._getHeader(token),
      };
      await axios(config);
    },
  },
};
