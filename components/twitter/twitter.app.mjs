import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { DateTime } from "luxon";
import retry from "async-retry";
import isoLanguages from "./sources/language-codes.mjs";

export default {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: "Search Term",
      description: "Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    keywordFilter: {
      type: "string",
      label: "Keywords",
      description: "Filter tweets based on keywords `star wars`, user mentions `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
      optional: true,
    },
    resultType: {
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
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets that can be accessed through the API. If the limit of Tweets has occurred since the `since_id`, the 'since_id` will be forced to the oldest ID available.",
      optional: true,
    },
    screenName: {
      type: "string",
      label: "Screen Name",
      description: "The screen name of the user (e.g., `pipedream`)",
    },
    trendLocation: {
      type: "string",
      label: "Location",
      description: "Location of trending topics",
      async options() {
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
    userId: {
      type: "string",
      label: "User ID",
      description: "The numerical ID of the user to lookup",
    },
    list: {
      type: "string",
      label: "List",
      description: "List to select",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const params = cursor
          ? {
            cursor,
          }
          : null;
        const lists = await this.getLists({
          params,
        });
        const { next_cursor: nextCursor } = lists;
        return {
          options: lists.map((list) => {
            return {
              label: list.name,
              value: list.id_str,
            };
          }),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    listSlug: {
      type: "string",
      label: "List",
      description: "List to select",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const params = cursor
          ? {
            cursor,
          }
          : null;
        const lists = await this.getLists({
          params,
        });
        const { next_cursor: nextCursor } = lists;
        return {
          options: lists.map((list) => {
            return {
              label: list.name,
              value: list.slug,
            };
          }),
          context: {
            cursor: nextCursor,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: `The text of the status update. Note: In order to comply with Twitter’s 
        terms of service, this text will have all @mentions removed. 
        Please refer to [our docs for more details](https://pipedream.com/docs/apps/twitter/#limitations-on-mentions).`,
    },
    inReplyToStatusId: {
      type: "string",
      label: "In Reply To Status ID",
      description: `The ID of an existing status that the update is in reply to. Note: This 
        parameter will be ignored unless the author of the Tweet this parameter 
        references is mentioned within the status text. Therefore, you must 
        include \`@username\` , where \`username\` is the author of the referenced 
        Tweet, within the update.`,
      optional: true,
    },
    autoPopulateReplyMetadata: {
      type: "boolean",
      label: "Auto Populate Reply Metadata",
      description: `If set to true and used with \`in_reply_to_status_id\`, leading 
        \`@mentions\` will be looked up from the original Tweet, and added to the 
        new Tweet from there. This will append \`@mentions\` into the metadata 
        of an extended Tweet as a reply chain grows, until the limit on 
        \`@mentions\` is reached. In cases where the original Tweet has been 
        deleted, the reply will fail.`,
      optional: true,
      default: false,
    },
    excludeReplyUserIds: {
      type: "string",
      label: "Exclude Reply User Ids",
      description: `When used with \`auto_populate_reply_metadata\`, a 
        comma-separated list of user ids which will be removed from the 
        server-generated \`@mentions\` prefix on an extended Tweet. Note that 
        the leading \`@mention\` cannot be removed as it would break the 
        \`in-reply-to-status-id\` semantics. Attempting to remove it will be 
        silently ignored.`,
      optional: true,
    },
    attachmentUrl: {
      type: "string",
      label: "Attachment URL",
      description: `In order for a URL to not be counted in the status body of an extended 
        Tweet, provide a URL as a Tweet attachment. This URL must be a 
        Tweet permalink or Direct Message deep link. Arbitrary, non-Twitter 
        URLs must remain in the status text. URLs passed to the 
        \`attachment_url\` parameter not matching either a Tweet permalink or 
        Direct Message deep link will fail at Tweet creation and cause an 
        exception.`,
      optional: true,
    },
    mediaIds: {
      type: "string",
      label: "Media IDs",
      description: `A comma-delimited list of \`media_ids\` to associate with the Tweet. You 
        may include up to 4 photos or 1 animated GIF or 1 video in a Tweet.`,
      optional: true,
    },
    possiblySensitive: {
      type: "boolean",
      label: "Possibly Sensitive",
      description: `If you upload Tweet media that might be considered sensitive content 
        such as nudity or medical procedures, you must set this value to true. 
        If this parameter is included in your request, it will override the user’s 
        preferences.`,
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location this Tweet refers to.",
      optional: true,
    },
    long: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location this Tweet refers to.",
      optional: true,
    },
    placeId: {
      type: "string",
      label: "Place ID",
      description: "A place in the world. These IDs can be retrieved from [geo/reverse_geocode](https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id)",
      optional: true,
    },
    displayCoordinates: {
      type: "boolean",
      label: "Display Coordinates",
      description: `Whether or not to put a pin on the exact coordinates a Tweet has been 
        sent from.`,
      optional: true,
    },
    trimUser: {
      type: "boolean",
      label: "Trim User",
      description: `When set to true, the response will include a user object including 
        only the author's ID.`,
      optional: true,
      default: false,
    },
    enableDmcommands: {
      type: "boolean",
      label: "Enable DM Commands",
      description: `When set to true, enables shortcode commands for sending Direct 
        Messages as part of the status text to send a Direct Message to a user. 
        When set to false, it turns off this behavior and includes any leading 
        characters in the status text that is posted.`,
      optional: true,
      default: false,
    },
    failDmcommands: {
      type: "boolean",
      label: "Fail DM Commands",
      description: `When set to true, causes any status text that starts with shortcode 
        commands to return an API error. When set to false, allows shortcode 
        commands to be sent in the status text and acted on by the API.`,
      optional: true,
      default: true,
    },
    cardUri: {
      type: "string",
      label: "Card URI",
      description: `Associate an ads card with the Tweet using the card_uri value from any 
        ads card response.`,
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Profile Image URL",
      description: "The avatar image for the profile",
    },
    skipStatus: {
      type: "boolean",
      label: "Skip Status",
      description: "When set to `true`, statuses will not be included in the returned user objects",
      optional: true,
      default: false,
    },
  },
  methods: {
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
    async _makeRequest({
      $, config,
    }) {
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      };
      return this._withRetries(
        () => axios($ ?? this, config, {
          oauthSignerUri: this.$auth.oauth_signer_uri,
          token,
        }),
      );
    },
    parseDate(dateStr) {
      // More info on the parsing tokens:
      // https://moment.github.io/luxon/docs/manual/parsing.html#table-of-tokens
      return DateTime.fromFormat(dateStr, "EEE MMM dd HH:mm:ss ZZZ yyyy");
    },
    /**
    * Enrich a Tweet object with ISO 8601 and timestamp (in milliseconds) representations of the
    * `created_at` date/time, Tweet URL and user profile URL.
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
    async getFollowers(opts = {}) {
      const {
        $,
        userId,
        screenName,
        includeUserEntities,
      } = opts;

      const params = {
        user_id: userId,
        screen_name: screenName,
        include_user_entities: includeUserEntities,
      };
      const config = {
        url: "https://api.twitter.com/1.1/followers/list.json",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getPendingFollowers({
      $, params,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/friendships/incoming.json",
      };
      if (params && Object.keys(params).length !== 0) config.params = params;
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async *scanFollowerIds(screenName) {
      const url = "https://api.twitter.com/1.1/followers/ids.json";
      const baseParams = {
        screen_name: screenName,
        stringify_ids: true,
      };
      const config = {
        url,
        params: baseParams,
      };
      let {
        ids,
        next_cursor: nextCursor,
        previous_cursor: prevCursor,
      } = await this._makeRequest({
        config,
      });
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
        ({
          ids,
          next_cursor: nextCursor,
          previous_cursor: prevCursor,
        } = await this._makeRequest({
          config,
        }));
      }
    },
    async getLists({
      $ = this, params,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/lists/list.json",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getPaginateListTweets(opts = {}) {
      let allTweets = [];
      let maxId;
      const pageSize = 100;
      do {
        const response = await this.getListTweets({
          ...opts,
          count: pageSize,
          maxId,
        });
        const tweets = response.filter((r) => r.id != maxId);
        if (!tweets || tweets.length < pageSize - 1) {
          maxId = null;
        } else {
          const tweetWithMinId = tweets.reduce((prev, current) => {
            return (prev.id < current.id) ?
              prev :
              current;
          }, {});
          maxId = tweetWithMinId?.id;
        }
        allTweets = allTweets.concat(tweets);
      } while (maxId);
      return allTweets;
    },
    async getListTweets(opts = {}) {
      const {
        $,
        listId,
        count,
        maxId,
        sinceId = "1",
        includeEntities = false,
        includeRetweets = false,
        tweetMode = "extended",
      } = opts;
      const url = "https://api.twitter.com/1.1/lists/statuses.json";
      const params = {
        list_id: listId,
        since_id: sinceId,
        max_id: maxId,
        count,
        include_entities: includeEntities,
        include_rts: includeRetweets,
        tweet_mode: tweetMode,
      };
      const config = {
        url,
        params,
      };
      return await this._makeRequest({
        $,
        config,
      });
    },
    async getLikedTweets(opts = {}) {
      const {
        $,
        screenName,
        count = 200,
        tweetMode = "extended",
      } = opts;
      const config = {
        url: "https://api.twitter.com/1.1/favorites/list.json",
        params: {
          screen_name: screenName,
          count,
          tweet_mode: tweetMode,
        },
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async lookupUsers(opts = {}) {
      const {
        $,
        userIdArray = [],
        screenNameArray = [],
      } = opts;
      const config = {
        url: "https://api.twitter.com/1.1/users/lookup.json",
        params: {
          user_id: userIdArray.join(),
          screen_name: screenNameArray.join(),
        },
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async search(opts = {}) {
      const {
        $,
        q,
        sinceId,
        tweetMode,
        count,
        resultType,
        locale,
        geocode,
        maxId,
      } = opts;
      const params = {
        q,
        since_id: sinceId,
        max_id: maxId,
        tweet_mode: tweetMode,
        count,
        result_type: resultType,
        locale,
        geocode,
      };
      const config = {
        url: "https://api.twitter.com/1.1/search/tweets.json",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getTrendLocations(opts = {}) {
      const { $ } = opts;
      const config = {
        url: "https://api.twitter.com/1.1/trends/available.json",
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getTrends(opts = {}) {
      const {
        $,
        id = 1,
      } = opts;
      const config = {
        url: "https://api.twitter.com/1.1/trends/place.json",
        params: {
          id,
        },
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getUserTimeline(opts = {}) {
      const {
        $,
        screenName,
        count = 100,
        excludeReplies,
        includeRts,
        sinceId,
      } = opts;

      const params = {
        screen_name: screenName,
        count,
        exclude_replies: excludeReplies,
        include_rts: includeRts,
        tweet_mode: "extended",
      };

      if (sinceId) {
        params.since_id = sinceId;
      }

      const config = {
        url: "https://api.twitter.com/1.1/statuses/user_timeline.json",
        method: "get",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getMentionsTimeline(opts = {}) {
      const {
        $,
        count,
        includeEntities = false,
      } = opts;

      const params = {
        count,
        include_entities: includeEntities,
      };

      const config = {
        url: "https://api.twitter.com/1.1/statuses/mentions_timeline.json",
        method: "GET",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getRetweets(opts = {}) {
      const {
        $,
        id,
        count = 100,
        sinceId = "1",
      } = opts;

      const params = {
        count,
        trim_user: false,
        since_id: sinceId,
      };

      const config = {
        url: `https://api.twitter.com/1.1/statuses/retweets/${id}.json`,
        method: "get",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getRetweetsOfMe(opts = {}) {
      const {
        $,
        count = 100,
        sinceId = "1",
        includeEntities = false,
        includeUserEntities = false,
      } = opts;

      const params = {
        count,
        since_id: sinceId,
        trim_user: false,
        include_entities: includeEntities,
        include_user_entities: includeUserEntities,
      };

      const config = {
        url: "https://api.twitter.com/1.1/statuses/retweets_of_me.json",
        method: "get",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async retweet({
      $, tweetID,
    }) {
      const config = {
        url: `https://api.twitter.com/1.1/statuses/retweet/${tweetID}.json`,
        method: "post",
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async searchHelper(opts = {}) {
      const tweets = [];

      const {
        $,
        tweetMode = "extended",
        resultType,
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
        maxId,
        sinceId,
      } = opts;
      let minId;

      const langs = lang
        .map((l) => `lang:${l}`)
        .join(" OR ");
      q = `${q} ${langs}`;
      q = `${q} ${includeReplies}:replies`;
      q = `${q} ${includeRetweets}:nativeretweets`;

      const response = await this.search({
        $,
        q,
        sinceId,
        tweetMode,
        count,
        resultType,
        locale,
        geocode,
        maxId,
      });

      if (!response) {
        console.log("Last request was not successful.");
        return {
          statusCode: "Error",
        };
      }

      for (const tweet of response.statuses) {
        if ((!sinceId || (sinceId && tweet.id_str !== sinceId)) &&
          (!maxId || (maxId && tweet.id_str !== maxId))) {
          if (enrichTweets) {
            tweets.push(this.enrichTweet(tweet));
          } else {
            tweets.push(tweet);
          }
          if (!maxId || tweet.id_str > maxId) {
            maxId = tweet.id_str;
            if (!minId) {
              minId = maxId;
            }
          }
          if (tweet.id_str < maxId) {
            minId = tweet.id_str;
          }
        }
      }

      return {
        tweets,
        maxId,
        minId,
        count,
        resultCount: response.statuses.length,
      };
    },
    async paginatedSearch(opts = {}) {
      const {
        $,
        count = 100,
        q,
        sinceId,
        lang,
        locale,
        geocode,
        resultType,
        enrichTweets,
        includeReplies,
        includeRetweets,
        limitFirstPage = true,
      } = opts;

      let {
          maxId,
          maxRequests = 1,
        } = opts, totalRequests = 0;

      const tweets = [];

      if (limitFirstPage) {
        maxRequests = 1;
      }

      for (let request = 0; request < maxRequests; request++) {
        const response = await this.searchHelper({
          $,
          count,
          q,
          sinceId,
          maxId,
          lang,
          locale,
          geocode,
          resultType,
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

        if (sinceId && totalRequests === maxRequests && response.resultCount === response.count) {
          console.log("The last API request returned the maximum number of results. There may be additional tweets matching your search criteria. To return more tweets, increase the maximum number of API requests per execution.");
        }

        if (response.length === 0 || response.resultCount < response.count) {
          break;
        }
        maxId = response.minId;
      }

      return tweets;
    },
    async verifyCredentials(opts = {}) {
      const { $ } = opts;
      const config = {
        url: "https://api.twitter.com/1.1/account/verify_credentials.json",
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async createTweet({
      $, params,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/statuses/update.json",
        method: "POST",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getTweet(opts = {}) {
      const {
        $,
        id,
        includeEntities = false,
      } = opts;
      const params = {
        id,
        include_entities: includeEntities,
      };
      const config = {
        url: "https://api.twitter.com/1.1/statuses/show.json",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async likeTweet(opts = {}) {
      const {
        $,
        id,
        includeEntities = false,
      } = opts;
      const params = {
        id,
        include_entities: includeEntities,
      };
      const config = {
        url: "https://api.twitter.com/1.1/favorites/create.json",
        method: "POST",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async unlikeTweet(opts = {}) {
      const {
        $,
        id,
        includeEntities = false,
      } = opts;
      const params = {
        id,
        include_entities: includeEntities,
      };
      const config = {
        url: "https://api.twitter.com/1.1/favorites/destroy.json",
        method: "POST",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async addUserToList(opts = {}) {
      const {
        $,
        slug,
        ownerScreenName,
        userId,
        screenName,
      } = opts;
      const params = {
        slug,
        owner_screen_name: ownerScreenName,
        user_id: userId,
        screen_name: screenName,
      };
      const config = {
        url: "https://api.twitter.com/1.1/lists/members/create.json",
        method: "POST",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async deleteTweet(opts = {}) {
      const {
        $,
        tweetID: id,
        trimUser,
      } = opts;
      const params = {
        id,
        trim_user: trimUser,
      };
      const config = {
        url: `https://api.twitter.com/1.1/statuses/destroy/${id}.json`,
        method: "POST",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async listDirectMessages({ $ }) {
      const config = {
        url: "https://api.twitter.com/1.1/direct_messages/events/list.json",
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async followUser({
      params,
      $,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/friendships/create.json",
        method: "post",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async unfollowUser({
      params,
      $,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/friendships/destroy.json",
        method: "post",
        params,
      };
      return (await this._makeRequest({
        $,
        config,
      }));
    },
    async getUserFollows({
      params, $ = this,
    }) {
      const config = {
        url: "https://api.twitter.com/1.1/friends/list.json",
        method: "GET",
        params,
      };
      return this._makeRequest({
        $,
        config,
      });
    },
    webhooks: {},
  },
};
