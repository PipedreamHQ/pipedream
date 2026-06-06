import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "xquik",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description:
        "Search query. Supports keywords, hashtags, exact phrases, and X search operators.",
    },
    queryType: {
      type: "string",
      label: "Query Type",
      description: "Sort order for tweet search results.",
      options: [
        "Latest",
        "Top",
      ],
      default: "Latest",
      optional: true,
    },
    tweetId: {
      type: "string",
      label: "Tweet ID",
      description:
        "The ID of the tweet to retrieve. Example: `1912345678901234567`.",
    },
    userId: {
      type: "string",
      label: "User ID or Username",
      description:
        "The X user ID or username. Usernames may include or omit the leading `@`. Examples: `@jack`, `123456`.",
    },
    sourceUserId: {
      type: "string",
      label: "Source Username",
      description:
        "The X username to check from. Usernames may include or omit the leading `@`. Examples: `@participant_handle`, `participant_handle`.",
    },
    targetUserId: {
      type: "string",
      label: "Target Username",
      description:
        "The X username to check against. Usernames may include or omit the leading `@`. Examples: `@brand_handle`, `brand_handle`.",
    },
    tweetInput: {
      type: "string",
      label: "Tweet URL or ID",
      description:
        "The X/Twitter post URL or numeric tweet ID to download media from. Examples: `https://x.com/username/status/1234567890123456789`, `1234567890123456789`.",
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from the previous response.",
      optional: true,
    },
    sinceTime: {
      type: "string",
      label: "Since Time",
      description:
        "ISO 8601 timestamp. Only return tweets after this time. Example: `2026-05-01T00:00:00Z`.",
      optional: true,
    },
    untilTime: {
      type: "string",
      label: "Until Time",
      description:
        "ISO 8601 timestamp. Only return tweets before this time. Example: `2026-05-02T00:00:00Z`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of tweets to return.",
      min: 1,
      max: 200,
      optional: true,
    },
    includeReplies: {
      type: "boolean",
      label: "Include Replies",
      description: "Include reply tweets in user timeline results.",
      default: false,
      optional: true,
    },
    includeParentTweet: {
      type: "boolean",
      label: "Include Parent Tweet",
      description:
        "Include the parent tweet for replies in user timeline results.",
      default: false,
      optional: true,
    },
    woeid: {
      type: "integer",
      label: "WOEID",
      description: "Region WOEID for trends. Use `1` for worldwide.",
      default: 1,
      min: 1,
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of trending topics to return.",
      default: 30,
      min: 1,
      max: 50,
      optional: true,
    },
  },
  methods: {
    /**
     * Return the base URL for the Xquik REST API.
     *
     * @returns {string} Base API URL.
     */
    _baseUrl() {
      return "https://xquik.com/api/v1";
    },
    /**
     * Build request headers for authenticated Xquik API calls.
     *
     * @returns {Record<string, string>} Headers for Xquik API requests.
     */
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "xquik-api-contract": "2026-04-29",
      };
    },
    /**
     * Remove empty query parameters while preserving false and zero values.
     *
     * @param {Record<string, unknown>} params Request query parameters.
     * @returns {Record<string, unknown>} Clean query parameters.
     */
    _cleanParams(params = {}) {
      return Object.fromEntries(
        Object.entries(params).filter(
          ([
            , value,
          ]) => value !== undefined && value !== null && value !== "",
        ),
      );
    },
    /**
     * Validate and normalize an API identifier.
     *
     * @param {unknown} value Identifier value.
     * @param {string} name Human-readable field name for errors.
     * @param {object} options Normalization options.
     * @param {boolean} [options.stripAt=false] Strip leading @ characters.
     * @returns {string} Normalized identifier.
     */
    _normalizeIdentifier(value, name, { stripAt = false } = {}) {
      const raw = String(value ?? "").trim();
      const identifier = stripAt
        ? raw.replace(/^@+/, "")
        : raw;

      if (!identifier) {
        throw new Error(`${name} is required`);
      }

      return identifier;
    },
    /**
     * Validate and normalize a username-only API input.
     *
     * @param {unknown} value Username value.
     * @param {string} name Human-readable field name for errors.
     * @returns {string} Normalized username.
     */
    _normalizeUsername(value, name) {
      const username = this._normalizeIdentifier(value, name, {
        stripAt: true,
      });

      if (
        /^\d+$/.test(username) ||
        /^https?:\/\//i.test(username) ||
        username.includes("/")
      ) {
        throw new Error(
          `${name} must be a username, not a numeric ID or profile URL. Use Get User first to resolve numeric IDs or profile URLs to usernames.`,
        );
      }

      return username;
    },
    /**
     * Validate and encode a URL path identifier.
     *
     * @param {unknown} value Identifier value.
     * @param {string} name Human-readable field name for errors.
     * @param {object} options Encoding options.
     * @param {boolean} [options.stripAt=false] Strip leading @ characters.
     * @returns {string} Encoded identifier.
     */
    _encodeIdentifier(value, name, { stripAt = false } = {}) {
      const identifier = this._normalizeIdentifier(value, name, {
        stripAt,
      });
      return encodeURIComponent(identifier);
    },
    /**
     * Send a request to the Xquik API.
     *
     * @param {object} request Request configuration.
     * @param {object} [request.$] Pipedream step context.
     * @param {string} request.path API path.
     * @param {Record<string, unknown>} [request.params] Query parameters.
     * @returns {Promise<unknown>} API response.
     */
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: this._cleanParams(params),
        ...opts,
      });
    },
    /**
     * Search public X/Twitter posts.
     *
     * @param {object} args Search arguments.
     * @returns {Promise<unknown>} Search results.
     */
    searchTweets({
      $, q, queryType, cursor, sinceTime, untilTime, limit,
    }) {
      return this._makeRequest({
        $,
        path: "/x/tweets/search",
        params: {
          q,
          queryType,
          cursor,
          sinceTime,
          untilTime,
          limit,
        },
      });
    },
    /**
     * Retrieve a public X/Twitter post by ID.
     *
     * @param {object} args Lookup arguments.
     * @returns {Promise<unknown>} Tweet response.
     */
    getTweet({
      $, tweetId,
    }) {
      const encodedTweetId = this._encodeIdentifier(tweetId, "Tweet ID");
      return this._makeRequest({
        $,
        path: `/x/tweets/${encodedTweetId}`,
      });
    },
    /**
     * Search public X/Twitter users.
     *
     * @param {object} args Search arguments.
     * @returns {Promise<unknown>} User search results.
     */
    searchUsers({
      $, q, cursor,
    }) {
      return this._makeRequest({
        $,
        path: "/x/users/search",
        params: {
          q,
          cursor,
        },
      });
    },
    /**
     * Retrieve a public X/Twitter user profile by username or ID.
     *
     * @param {object} args Lookup arguments.
     * @returns {Promise<unknown>} User profile response.
     */
    getUser({
      $, userId,
    }) {
      const encodedUserId = this._encodeIdentifier(
        userId,
        "User ID or Username",
        {
          stripAt: true,
        },
      );
      return this._makeRequest({
        $,
        path: `/x/users/${encodedUserId}`,
      });
    },
    /**
     * List public X/Twitter posts from a user.
     *
     * @param {object} args Timeline arguments.
     * @returns {Promise<unknown>} User timeline response.
     */
    getUserTweets({
      $, userId, cursor, includeReplies, includeParentTweet,
    }) {
      const encodedUserId = this._encodeIdentifier(
        userId,
        "User ID or Username",
        {
          stripAt: true,
        },
      );
      return this._makeRequest({
        $,
        path: `/x/users/${encodedUserId}/tweets`,
        params: {
          cursor,
          includeReplies,
          includeParentTweet,
        },
      });
    },
    /**
     * Retrieve public X/Twitter trends by region.
     *
     * @param {object} args Trend arguments.
     * @returns {Promise<unknown>} Trends response.
     */
    getTrends({
      $, woeid, count,
    }) {
      return this._makeRequest({
        $,
        path: "/x/trends",
        params: {
          woeid,
          count,
        },
      });
    },
    /**
     * Check if one public X/Twitter user follows another.
     *
     * @param {object} args Follow check arguments.
     * @returns {Promise<unknown>} Follow check response.
     */
    checkFollower({
      $, sourceUserId, targetUserId,
    }) {
      const source = this._normalizeUsername(sourceUserId, "Source user");
      const target = this._normalizeUsername(targetUserId, "Target user");

      return this._makeRequest({
        $,
        path: "/x/followers/check",
        params: {
          source,
          target,
        },
      });
    },
    /**
     * Download media from a public X/Twitter post.
     *
     * @param {object} args Media download arguments.
     * @returns {Promise<unknown>} Media download response.
     */
    downloadTweetMedia({
      $, tweetInput,
    }) {
      const normalizedTweetInput = this._normalizeIdentifier(
        tweetInput,
        "Tweet URL or ID",
      );

      return this._makeRequest({
        $,
        method: "POST",
        path: "/x/media/download",
        data: {
          tweetInput: normalizedTweetInput,
        },
      });
    },
  },
};
