import { axios } from "@pipedream/platform";
import jwt from "jsonwebtoken";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ghost_org_admin_api",
  methods: {
    getURL(path) {
      return `${this.$auth.admin_api_url}${constants.VERSION_PATH}${path}`;
    },
    getHeader() {
      const token = this.getToken();
      return {
        Authorization: `Ghost ${token}`,
      };
    },
    getToken() {
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
    async makeRequest({
      $ = this, path, ...args
    } = {}) {
      const config = {
        url: this.getURL(path),
        headers: this.getHeader(),
        ...args,
      };
      return axios($, config);
    },
    async createHook(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/webhooks",
        ...args,
      });
    },
    async deleteHook({
      hookId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/webhooks/${hookId}`,
        ...args,
      });
    },
    async createPost(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/posts",
        ...args,
      });
    },
  },
};
