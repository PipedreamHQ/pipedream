import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "codeqr",
  propDefinitions: {
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The unique ID of a link",
      async options({ page }) {
        const links = await this.listLinks({
          params: {
            page: page + 1,
          },
        });
        return links?.map((link) => ({
          label: link.url,
          value: link.id,
        }));
      },
    },
    qrcodeId: {
      type: "string",
      label: "QR Code ID",
      description: "The unique ID of a QR Code",
      async options({ page }) {
        const qrCodes = await this.listQrCodes({
          params: {
            page: page + 1,
          },
        });
        return qrCodes?.map((qrCode) => ({
          label: qrCode.url,
          value: qrCode.id,
        }));
      },
    },
  },
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
    async makeRequest(args = {}) {
      const {
        $ = this, method = "get", path, ...opts
      } = args;
      const config = {
        method,
        url: this.getUrl(path),
        headers: this.getHeader(),
        ...opts,
      };
      return axios($, config);
    },
    async listLinks(opts = {}) {
      return this.makeRequest({
        path: "/links",
        ...opts,
      });
    },
    async listQrCodes(opts = {}) {
      return this.makeRequest({
        path: "/qrcodes",
        ...opts,
      });
    },
    async createLink(opts = {}) {
      return this.makeRequest({
        method: "post",
        path: "/links",
        ...opts,
      });
    },
    async getLinkInfo(opts = {}) {
      return this.makeRequest({
        path: "/links/info",
        ...opts,
      });
    },
    async deleteLink({
      identifier, ...opts
    }) {
      return this.makeRequest({
        method: "delete",
        path: `/links/${identifier}`,
        ...opts,
      });
    },
    async createQrcode(opts = {}) {
      return this.makeRequest({
        method: "post",
        path: "/qrcodes",
        ...opts,
      });
    },
    async getQrcodeInfo(opts = {}) {
      return this.makeRequest({
        path: "/qrcodes/info",
        ...opts,
      });
    },
    async deleteQrcode({
      identifier, ...opts
    }) {
      return this.makeRequest({
        method: "delete",
        path: `/qrcodes/${identifier}`,
        ...opts,
      });
    },
  },
};
