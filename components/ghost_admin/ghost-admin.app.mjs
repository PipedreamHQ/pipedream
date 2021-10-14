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
    async _getHeader() {
      const token = await this._getToken();
      return {
        Authorization: `Ghost ${token}`,
      };
    },
    _getToken() {
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
      const res = await this.makeHttpCreateHookRequest(data);
      if (!lodash.get(res, "data.webhooks[0].id")) {
        console.log(res.data);
        throw new Error("No webhook id was returned by Ghost. Please try again.");
      }

      return res.data.webhooks[0].id;
    },
    async deleteHook(hookId) {
      if (!hookId) {
        console.warn("No hookId provided. None webhook deleted");
      }
      await this.makeHttpDeleteHookRequest(hookId);
    },
    async makeHttpCreateHookRequest(data) {
      const config = {
        method: "post",
        url: `${this._getBaseURL()}/webhooks`,
        headers: await this._getHeader(),
        data,
      };
      return await axios(config);
    },
    async makeHttpDeleteHookRequest(hookId) {
      const config = {
        method: "delete",
        url: `${this._getBaseURL()}/webhooks/${hookId}`,
        headers: await this._getHeader(),
      };
      await axios(config);
    },
  },
};
