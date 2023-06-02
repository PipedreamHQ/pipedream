const TwitterV1 = require("twit");
const TwitterV2 = require("twitter-v2");

module.exports = {
  type: "app",
  app: "twitter_developer_app",
  methods: {
    _newClientV1() {
      return new TwitterV1({
        consumer_key: this.$auth.api_key,
        consumer_secret: this.$auth.api_secret_key,
        access_token: this.$auth.access_token,
        access_token_secret: this.$auth.access_token_secret,
      });
    },
    _newClientV2() {
      return new TwitterV2({
        consumer_key: this.$auth.api_key,
        consumer_secret: this.$auth.api_secret_key,
        access_token_key: this.$auth.access_token,
        access_token_secret: this.$auth.access_token_secret,
      });
    },
    async getAccountId() {
      const client = this._newClientV1();
      const path = "account/verify_credentials";
      const params = {
        skip_status: true,
      };
      const { data } = await client.get(path, params);
      return data.id_str;
    },
    /**
     * This function retrieves the metrics for a list of Tweet ID's. By default,
     * it retrieves the public, non-public and organic metrics, but these can be
     * excluded by providing different values for the flag arguments.
     *
     * For more information about the specific metrics, see the API docs:
     * https://developer.twitter.com/en/docs/twitter-api/metrics
     *
     * @param {object}    opts parameters for the retrieval of Tweets metrics
     * @param {string[]}  opts.tweetIds the list of Tweet ID's for which to
     * retrieve the metrics
     * @param {boolean}   [opts.excludePublic=false] if set, the public metrics
     * will not be retrieved
     * @param {boolean}   [opts.excludeNonPublic=false] if set, the non-public
     * metrics will not be retrieved
     * @param {boolean}   [opts.excludeOrganic=false] if set, the organic
     * metrics will not be retrieved
     * @returns a metrics object containing the metrics for the specified Tweet
     * ID's
     */
    async getMetricsForIds({
      tweetIds,
      excludePublic = false,
      excludeNonPublic = false,
      excludeOrganic = false,
    }) {
      if (!tweetIds) {
        throw new Error("The 'tweetIds' argument is mandatory");
      }

      const client = this._newClientV2();
      const path = "tweets";
      const metrics = [
        excludePublic
          ? undefined
          : "public_metrics",
        excludeNonPublic
          ? undefined
          : "non_public_metrics",
        excludeOrganic
          ? undefined
          : "organic_metrics",
      ].filter((i) => i);
      const params = {
        "ids": tweetIds,
        "expansions": [
          "attachments.media_keys",
        ],
        "media.fields": metrics,
        "tweet.fields": metrics,
      };
      return client.get(path, params);
    },
  },
};
