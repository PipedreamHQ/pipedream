import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bitly",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    async createBitlink(data) {
      return await axios(this.$auth, {
        method: "post",
        url: "https://api-ssl.bitly.com/v4/bitlinks",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async getBitlink(bitlink) {
      return await axios(this.$auth, {
        method: "get",
        url: `https://api-ssl.bitly.com/v4/bitlinks/${bitlink}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async expandBitlink(data) {
      return await axios(this.$auth, {
        method: "post",
        url: "https://api-ssl.bitly.com/v4/expand",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async listBitlinkByGroup(url) {
      return await axios(this.$auth, {
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
  },
};
