import { axios } from "@pipedream/platform";

export default {
  methods: {
    async createBitlink($, payload, oauth_access_token) {
      return await axios($, {
        method: "post",
        url: "https://api-ssl.bitly.com/v4/bitlinks",
        headers: {
          Authorization: `Bearer ${oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });
    },
  },
};
