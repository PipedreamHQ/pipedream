import { axios } from "@pipedream/platform";
import constants from "./common/common.constants.mjs";

export default {
  type: "app",
  app: "bitly",
  propDefinitions: {},
  methods: {
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async createBitlink(data) {
      return await axios(this.$auth, {
        method: "post",
        url: `${constants.BASE_URL}/bitlinks`,
        headers: this._getHeaders(),
        data,
      });
    },
    async getBitlink(bitlink) {
      return await axios(this.$auth, {
        method: "get",
        url: `${constants.BASE_URL}/bitlinks/${bitlink}`,
        headers: this._getHeaders(),
      });
    },
    async expandBitlink(data) {
      return await axios(this.$auth, {
        method: "post",
        url: `${constants.BASE_URL}/expand`,
        headers: this._getHeaders(),
        data,
      });
    },
    async listBitlinkByGroup(groupGuid, params) {
      return await axios(this.$auth, {
        method: "get",
        url: `${constants.BASE_URL}/groups/${groupGuid}/bitlinks`,
        headers: this._getHeaders(),
        params,
      });
    },
  },
};
