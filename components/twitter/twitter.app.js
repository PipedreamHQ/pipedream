/* eslint-disable */
const axios = require("axios");
const get = require("lodash/get");
const { DateTime } = require("luxon");
const querystring = require("querystring");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: "Search Term",
      description: "Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    keyword_filter: {
      type: "string",
      label: "Keywords",
      description: "Filter tweets based on keywords `star wars`, user mentions `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
      optional: true,
    },
    result_type: {
      type: "string",
      label: "Result Type",
      description: "Specifies the type of results you want to retrieve.",
      optional: true,
      options: [
        {
          label: "Recent",
          value: "recent",
        },
        {
          label: "Popular",
          value: "popular",
        },
        {
          label: "Mixed",
          value: "mixed",
        },
      ],
      default: "recent",
    },
    count: {
      type: "integer",
      min: 1,
      max: 100,
      label: "Count (advanced)",
      description: "The maximum number of tweets to return per API request (up to `100`)",
      optional: true,
      default: 100,
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution (advanced)",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results). **Note:** Twitter [rate limits API requests](https://developer.twitter.com/en/docs/basics/rate-limiting) per 15 minute interval.",
      optional: true,
      default: 1,
    },
    from: {
      type: "string",
      label: "From",
      description: "The screen name of the user (e.g., `pipedream`)",
    },
    geocode: {
      type: "string",
      label: "Geocode",
      description: "Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by `latitude,longitude,radius`, where radius units must be specified as either `mi` (miles) or `km` (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly.",
      optional: true,
    },
    includeRetweets: {
      type: "string",
      label: "Retweets",
      description: "Select whether to **include**, **exclude** or **only include** retweets in emitted events.",
      optional: true,
      options: [
        {
          label: "Include",
          value: "include",
        },
        {
          label: "Exclude",
          value: "exclude",
        },
        {
          label: "Only include retweets",
          value: "filter",
        },
      ],
      default: "include",
    },
    includeReplies: {
      type: "string",
      label: "Replies",
      description: "Select whether to **include**, **exclude** or **only include** replies in emitted events.",
      optional: true,
      options: [
        {
          label: "Include",
          value: "include",
        },
        {
          label: "Exclude",
          value: "exclude",
        },
        {
          label: "Only include replies",
          value: "filter",
        },
      ],
      default: "include",
    },
    enrichTweets: {
      type: "boolean",
      label: "Enrich Tweets",
      description: "Enrich each Tweet with epoch (milliseconds) and ISO 8601 representations of Twitter's `created_at` timestamp, the Tweet URL, and the profile URL for the author.",
      optional: true,
      default: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Specify the language of the query you are sending (only `ja` is currently effective). This is intended for language-specific consumers and the default should work in the majority of cases.",
      optional: true,
    },
    lang: {
      type: "string[]",
      label: "Languages",
      description: "Restricts tweets to the given languages. Language detection is best-effort. When unsure, leave blank.",
      default: [],
      optional: true,
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const isoLanguages = require("./sources/language-codes");
        return isoLanguages.map((isoLanguage) => {
          const {
            English: language,
            alpha2: code,
          } = isoLanguage;
          return {
            label: `${language} (${code})`,
            value: code,
          };
        });
      },
    },
    since_id: {
      type: "string",
      label: "Since ID",
      description: "Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets which can be accessed through the API. If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.",
      optional: true,
    },
    screen_name: {
      type: "string",
      label: "Screen Name",
      description: "The screen name of the user (e.g., `pipedream`)",
    },
    trendLocation: {
      type: "string",
      label: "Location",
      async options(opts) {
        const trendLocations = await this.getTrendLocations();
        return trendLocations.map((location) => {
          return {
            label: `${location.name}, ${location.countryCode} (${location.placeType.name})`,
            value: location.woeid,
          };
        });
      },
    },
    includeEntities: {
      type: "boolean",
      label: "Entities",
      description: "The tweet 'entities' node will not be included when set to false",
      default: false,
    },
    includeUserEntities: {
      type: "boolean",
      label: "User Entities",
      description: "The user 'entities' node will not be included when set to false",
      default: false,
    },
    tweetID: {
      type: "string",
      label: "Tweet ID",
      description: "The numerical ID of the tweet ID (also known as \"status\")",
    },
  },
  methods: {
    async _getAuthorizationHeader({
      data, method, url,
    }) {
      const requestData = {
        data,
        method,
        url,
      };
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      };
      return (await axios({
        method: "POST",
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        },
      })).data;
    },
    _isRetriableStatusCode(statusCode) {
      // Taken from the Twitter API docs:
      // https://developer.twitter.com/en/docs/twitter-ads-api/response-codes
      return [
        423,  // LOCK_ACQUISITION_TIMEOUT
        429,  // TOO_MANY_REQUESTS | TWEET_RATE_LIMIT_EXCEEDED
        500,  // INTERNAL_ERROR
        503,  // SERVICE_UNAVAILABLE | OVER_CAPACITY
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 2,
        factor: 2,
        minTimeout: 2000, // In milliseconds
      };
      return retry(async (bail, retryCount) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            const errData = get(err, [
              "response",
              "data",
            ], {});
            return bail(new Error(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(errData, null, 2)}
            `));
          }

          console.log(`
            [Attempt #${retryCount}] Temporary error: ${err.message}
          `);
          throw err;
        }
      }, retryOpts);
    },
    async _makeRequest(config) {
      if (!config.headers) config.headers = {};
      if (config.params) {
        const query = querystring.stringify(config.params);
        delete config.params;
        const sep = config.url.indexOf("?") === -1
          ? "?"
          : "&";
        config.url += `${sep}${query}`;
        config.url = config.url.replace("?&", "?");
      }
      let authorization, count = 0;
      const maxTries = 3;
      while (true) {
        try {
          authorization = await this._getAuthorizationHeader(config);
          break;
        } catch (err) {
          // handle exception
          if (++count == maxTries) {
            throw err;
          }
          const milliseconds = 1000 * count;
          await new Promise((resolve) => setTimeout(resolve, milliseconds));
        }
      }
      config.headers.authorization = authorization;

      return this._withRetries(
        () => axios(config),
      );
    },
    parseDate(dateStr) {
      // More info on the parsing tokens:
      // https://moment.github.io/luxon/docs/manual/parsing.html#table-of-tokens
      return DateTime.fromFormat(dateStr, "EEE MMM dd HH:mm:ss ZZZ yyyy");
    },
    /**
    * Enrich a Tweet object with ISO 8601 and timestamp (in milliseconds) representations of the `created_at` date/time, Tweet URL and user profile URL.
    * @params {Object} tweet - An object representing a single Tweet as returned by Twitter's API
    * @returns {Object} An enriched Tweet object is returned.
    */
    enrichTweet(tweet) {
      const parsedDate = this.parseDate(tweet.created_at);
      tweet.created_at_timestamp = parsedDate.valueOf();
      tweet.created_at_iso8601 = parsedDate.toISO();
      tweet.url = `https://twitter.com/${tweet.user.screen_name}/statuses/${tweet.id_str}`;
      if (tweet.user) tweet.user.profile_url = `https://twitter.com/${tweet.user.screen_name}/`;
      return tweet;
    },
    async getFollowers(screen_name) {
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/followers/ids.json?",
        params: {
          screen_name,
          stringify_ids: true,
        },
      })).data.ids;
    },
    async *scanFollowerIds(screenName) {
      const url = "https://api.twitter.com/1.1/followers/ids.json?";
      const baseParams = {
        screen_name: screenName,
        stringify_ids: true,
      };
      const config = {
        url,
        params: baseParams,
      };
      const { data } = await this._makeRequest(config);
      let {
        ids,
        next_cursor: nextCursor,
        previous_cursor: prevCursor,
      } = data;
      while (nextCursor !== 0 || prevCursor === 0) {
        for (const id of ids) {
          yield id;
        }

        if (nextCursor === 0) {
          return;
        }

        const params = {
          ...baseParams,
          cursor: nextCursor,
        };
        const config = {
          url,
          params,
        };
        const { data } = await this._makeRequest(config);
        ({
          ids,
          next_cursor: nextCursor,
          previous_cursor: prevCursor,
        } = data);
      }
    },
    async getLists() {
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/lists/list.json",
      })).data;
    },
    async getListTweets(opts = {}) {
      const {
        list_id,
        count,
        since_id = "1",
        includeEntities = false,
        includeRetweets = false,
      } = opts;
      const url = "https://api.twitter.com/1.1/lists/statuses.json?";
      const params = {
        list_id,
        since_id,
        count,
        include_entities: includeEntities,
        include_rts: includeRetweets,
      };
      const config = {
        url,
        params,
      };
      const { data } = await this._makeRequest(config);
      return data;
    },
    async getLikedTweets(opts = {}) {
      const {
        screen_name,
        count = 200,
        tweet_mode = "extended",
      } = opts;
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/favorites/list.json",
        params: {
          screen_name,
          count,
          tweet_mode,
        },
      })).data;
    },
    async lookupUsers(userIdArray) {
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/users/lookup.json",
        params: {
          user_id: userIdArray.join(),
        },
      })).data;
    },
    async search(opts = {}) {
      const {
        q,
        since_id,
        tweet_mode,
        count,
        result_type,
        locale,
        geocode,
        max_id,
      } = opts;
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/search/tweets.json",
        params: {
          q,
          since_id,
          max_id,
          tweet_mode,
          count,
          result_type,
          locale,
          geocode,
        },
      }));
    },
    async getTrendLocations() {
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/trends/available.json",
      })).data;
    },
    async getTrends(opts = {}) {
      const { id = 1 } = opts;
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/trends/place.json",
        params: {
          id,
        },
      })).data;
    },
    async getUserTimeline(opts = {}) {
      const {
        screen_name,
        count = 100,
        exclude_replies,
        include_rts,
        since_id,
      } = opts;

      const params = {
        screen_name,
        count,
        exclude_replies,
        include_rts,
        tweet_mode: "extended",
      };

      if (since_id) {
        params.since_id = since_id;
      }

      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/statuses/user_timeline.json",
        method: "get",
        params,
      })).data;
    },
    async getRetweets(opts = {}) {
      const {
        id,
        count = 100,
        since_id = "1",
      } = opts;

      const params = {
        count,
        trim_user: false,
        since_id,
      };

      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/statuses/retweets/${id}.json`,
        method: "get",
        params,
      })).data;
    },
    async getRetweetsOfMe(opts = {}) {
      const {
        count = 100,
        since_id = "1",
        include_entities = false,
        include_user_entities = false,
      } = opts;

      const params = {
        count,
        since_id,
        trim_user: false,
        include_entities,
        include_user_entities,
      };

      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/statuses/retweets_of_me.json",
        method: "get",
        params,
      })).data;
    },
    async retweet({ tweetID }) {
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/statuses/retweet/${tweetID}.json`,
        method: "post",
      })).data;
    },
    async searchHelper(opts = {}) {
      const tweets = [];

      const {
        tweet_mode = "extended",
        result_type,
        count = 100,
        lang = [],
        locale,
        geocode,
        enrichTweets = true,
        includeReplies = "include",
        includeRetweets = "include",
      } = opts;

      let {
        q,
        max_id,
        since_id,
      } = opts;
      let min_id;

      const langs = lang
        .map((l) => `lang:${l}`)
        .join(" OR ");
      q = `${q} ${langs}`;
      q = `${q} ${includeReplies}:replies`;
      q = `${q} ${includeRetweets}:nativeretweets`;

      const response = await this.search({
        q,
        since_id,
        tweet_mode,
        count,
        result_type,
        locale,
        geocode,
        max_id,
      });

      if (!response) {
        console.log("Last request was not successful.");
        return {
          statusCode: "Error",
        };
      }

      for (const tweet of response.data.statuses) {
        if ((!since_id || (since_id && tweet.id_str !== since_id)) && (!max_id || (max_id && tweet.id_str !== max_id))) {
          if (enrichTweets) {
            tweets.push(this.enrichTweet(tweet));
          } else {
            tweets.push(tweet);
          }
          if (!max_id || tweet.id_str > max_id) {
            max_id = tweet.id_str;
            if (!min_id) {
              min_id = max_id;
            }
          }
          if (tweet.id_str < max_id) {
            min_id = tweet.id_str;
          }
        }
      }

      return {
        tweets,
        max_id,
        min_id,
        count,
        resultCount: response.data.statuses.length,
        statusCode: response.status,
      };
    },
    async paginatedSearch(opts = {}) {
      const {
        count = 100,
        q,
        since_id,
        lang,
        locale,
        geocode,
        result_type,
        enrichTweets,
        includeReplies,
        includeRetweets,
        limitFirstPage = true,
      } = opts;

      let {
          max_id,
          maxRequests = 1,
        } = opts, totalRequests = 0;

      const tweets = [];

      if (limitFirstPage) {
        maxRequests = 1;
      }

      //console.log(maxPages)

      for (let request = 0; request < maxRequests; request++) {
        const response = await this.searchHelper({
          count,
          q,
          since_id,
          max_id,
          lang,
          locale,
          geocode,
          result_type,
          enrichTweets,
          includeReplies,
          includeRetweets,
        });

        // increment the count of requests to report out after all requests are complete
        totalRequests++;

        if (!response) {
          break;
        }

        tweets.push(...response.tweets);

        //console.log(`resultCount: ${response.resultCount} count: ${response.count}`)

        if (since_id && totalRequests === maxRequests && response.resultCount === response.count) {
          console.log("The last API request returned the maximum number of results. There may be additional tweets matching your search criteria. To return more tweets, increase the maximum number of API requests per execution.");
        }

        if (response.length === 0 || response.resultCount < response.count) {
          break;
        }
        max_id = response.min_id;
      }

      //console.log(`Made ${totalRequests} requests to the Twitter API and returned ${tweets.length} tweets.`)

      return tweets;
    },
    async verifyCredentials() {
      return (await this._makeRequest({
        url: "https://api.twitter.com/1.1/account/verify_credentials.json",
      })).data;
    },
    webhooks: {
      // TODO
    },
  },
};
