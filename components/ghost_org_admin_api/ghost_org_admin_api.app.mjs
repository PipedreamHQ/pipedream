import axios from "axios";
import jwt from "jsonwebtoken";

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
      const res = await this.makeHttpRequest("post", "/webhooks", data);
      if (!res?.data?.webhooks?.[0]?.id) {
        console.log(res.data);
        throw new Error("No webhook id was returned by Ghost. Please try again.");
      }

      return res.data.webhooks[0].id;
    },
    async deleteHook(hookId) {
      if (!hookId) {
        console.warn("No hookId provided. No webhook deleted");
      }
      await this.makeHttpRequest("delete", `/webhooks/${hookId}`);
    },
    async makeHttpRequest(method, path, data) {
      const config = {
        method,
        url: this._getBaseURL() + path,
        headers: await this._getHeader(),
        data,
      };
      return await axios(config);
    },
  },
};
