import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "codeqr",
  propDefinitions: {},
  methods: {
    getHeader() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    getUrl(path) {
      const { BASE_URL } = constants;
      return `${BASE_URL}${path}`;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async makeRequest(args = {}) {
      const {
        $ = this, method = "get", path, params, data,
      } = args;
      const config = {
        method,
        url: this.getUrl(path),
        headers: this.getHeader(),
        params,
        data,
      };
      return axios($, config);
    },
    async createLink(data) {
      return this.makeRequest({
        method: "post",
        path: "/links",
        data,
      });
    },
    async getLinkInfo(params) {
      return this.makeRequest({
        path: "/links/info",
        params,
      });
    },
    async deleteLink(identifier) {
      return this.makeRequest({
        method: "delete",
        path: `/links/${identifier}`,
      });
    },
    async createQrcode(data) {
      return this.makeRequest({
        method: "post",
        path: "/qrcodes",
        data,
      });
    },
    async getQrcodeInfo(params) {
      return this.makeRequest({
        path: "/qrcodes/info",
        params,
      });
    },
    async deleteQRCode(identifier) {
      return this.makeRequest({
        method: "delete",
        path: `/qrcodes/${identifier}`,
      });
    },
  },
};
