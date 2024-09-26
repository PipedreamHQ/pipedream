import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "bitly",
  propDefinitions: {},
  methods: {
    getHeader() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    getUrl(path) {
      const {
        BASE_URL,
        VERSION_PATH,
      } = constants;
      return `${BASE_URL}${VERSION_PATH}${path}`;
    },
    async makeRequest(args = {}) {
      const {
        $ = this,
        method = "get",
        path,
        params,
        data,
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
    async createBitlink(data) {
      return this.makeRequest({
        method: "post",
        path: "/bitlinks",
        data,
      });
    },
    async getBitlink(bitlink) {
      return this.makeRequest({
        path: `/bitlinks/${bitlink}`,
      });
    },
    async expandBitlink(data) {
      return this.makeRequest({
        method: "post",
        path: "/expand",
        data,
      });
    },
    async listBitlinkByGroup(groupGuid, params) {
      return this.makeRequest({
        path: `/groups/${groupGuid}/bitlinks`,
        params,
      });
    },
    async updateBitlink(bitlink, data) {
      return this.makeRequest({
        method: "patch",
        path: `/bitlinks/${bitlink}`,
        data,
      });
    },
  },
};
