import OAuth from "oauth-1.0a";
import crypto from "crypto";
import {
  axios, transformConfigForOauth,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "twitter_ads",
  propDefinitions: {},
  methods: {
    _getAuthHeader(config) {
      const {
        developer_consumer_key: devKey,
        developer_consumer_secret: devSecret,
        oauth_access_token: key,
        oauth_refresh_token: secret,
      } = this.$auth;

      const consumer = {
        key: devKey,
        secret: devSecret,
      };

      const oauth = new OAuth({
        consumer,
        signature_method: "HMAC-SHA1",
        hash_function(base_string, key) {
          return crypto
            .createHmac("sha1", key)
            .update(base_string)
            .digest("base64");
        },
      });

      const token = {
        key,
        secret,
      };

      const requestData = transformConfigForOauth(config);

      return oauth.toHeader(oauth.authorize(requestData, token));
    },
    _getBaseUrl() {
      return "https://ads-api.twitter.com/12";
    },
    async _httpRequest({
      $ = this, headers, ...args
    }) {
      const config = {
        baseURL: this._getBaseUrl(),
        ...args,
      };

      const axiosConfig = {
        ...config,
        headers: {
          ...headers,
          ...this._getAuthHeader(config),
        },
      };

      return axios($, axiosConfig);
    },
  },
};
