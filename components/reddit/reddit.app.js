const axios = require("axios");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "reddit",
  propDefinitions: {
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch.",
      useQuery: true,
      async options(context) {
        const q = context.query;
        const options = [];
        const results = await this.getAllSearchSubredditsResults(q);
        for (const subreddit of results) {
          options.push({
            label: subreddit.title,
            value: subreddit.name,
          });
        }
        return options;
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username you'd like to watch.",
    },
    timeFilter: {
      type: "string",
      label: "Time filter",
      description:
        "If set to all, all existing links or comments, before applying dedupe strategy, will be considered to be emitted. Otherwise, the indicated time frame will be used for getting links or comments.",
      options: ["hour", "day", "week", "month", "year", "all"],
      default: "all",
      optional: true,
    },
    includeSubredditDetails: {
      type: "boolean",
      label: "Include subreddit details?",
      description:
        "If set to true, subreddit details will be expanded/included in the emitted event.",
      default: false,
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://oauth.reddit.com`;
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._accessToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return (await axios(opts)).data;
    },
    _isRetriableStatusCode(statusCode) {
      [408, 429, 500].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, ["response", "status"]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${err.response}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    /**
     * This method retrieves the most recent new hot subreddit posts. The
     * returned dataset contains at most `opts.limit` entries.
     *
     * @param {string}  subreddit the subreddit from which to retrieve the
     * hot posts
     * @param {enum}    region the region from where to retrieve the hot
     * posts (e.g. `GLOBAL`, `US`, `AR`, etc.). See the `g` parameter in the
     * docs for more information: https://www.reddit.com/dev/api/#GET_hot
     * @param {boolean} [excludeFilters=false] if set to `true`, filters
     * such as "hide links that I have voted on" will be disabled
     * @param {boolean} [includeSubredditDetails=false] whether the
     * subreddit details should be expanded/included or not
     * @param {number}  [limit=100] the maximum amount of posts to retrieve
     * @returns the list of new hot posts belonging to the specified subreddit
     */
    async getNewHotSubredditPosts(
      subreddit,
      region,
      excludeFilters,
      includeSubredditDetails,
      limit = 100
    ) {
      const params = {};
      if (excludeFilters) {
        params["show"] = "all";
      }
      params["g"] = region;
      params["sr_detail"] = includeSubredditDetails;
      params["limit"] = limit;
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/hot`,
          params,
        })
      );
    },
    async getNewSubredditLinks(before, subreddit, limit = 100) {
      const params = {
        before,
        limit,
      };
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/new`,
          params,
        })
      );
    },
    async getNewSubredditComments(
      subreddit,
      subredditPost,
      numberOfParents,
      depth,
      includeSubredditDetails,
      limit = 100
    ) {
      const params = {
        article: subredditPost,
        context: numberOfParents,
        depth,
        limit,
        sort: "new",
        sr_detail: includeSubredditDetails,
        theme: "default",
        threaded: true,
        trucate: 0,
      };
      const [redditArticle, redditComments] = await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/comments/article`,
          params,
        })
      );
      return redditComments;
    },
    async getNewUserLinks(
      before,
      username,
      numberOfParents,
      timeFilter,
      includeSubredditDetails,
      limit = 100
    ) {
      const params = {
        before,
        context: numberOfParents,
        show: "given",
        sort: "new",
        t: timeFilter,
        type: "links",
        sr_detail: includeSubredditDetails,
        limit,
      };
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/user/${username}/submitted`,
          params,
        })
      );
    },
    async getNewUserComments(
      before,
      username,
      numberOfParents,
      timeFilter,
      includeSubredditDetails,
      limit = 100
    ) {
      const params = {
        before,
        context: numberOfParents,
        show: "given",
        sort: "new",
        t: timeFilter,
        type: "comments",
        sr_detail: includeSubredditDetails,
        limit,
      };
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/user/${username}/comments`,
          params,
        })
      );
    },
    async searchSubreddits(after, query = "") {
      const params = {
        after,
        limit: 100,
        q: query,
        show_users: false,
        sort: "relevance",
        sr_detail: false,
        typeahead_active: false,
      };
      const redditCommunities = await this._withRetries(() =>
        this._makeRequest({
          path: `/subreddits/search`,
          params,
        })
      );
      return redditCommunities;
    },
    async getAllSearchSubredditsResults(query) {
      const results = [];
      let after = null;
      do {
        const redditCommunities = await this.searchSubreddits(after, query);
        const isNewDataAvailable = get(redditCommunities, [
          "data",
          "children",
          "length",
        ]);
        if (!isNewDataAvailable) {
          break;
        }
        const { children: communities = [] } = redditCommunities.data;
        after = communities[communities.length - 1].data.name;
        communities.forEach((subreddit) => {
          const { title, name } = subreddit.data;
          results.push({
            title,
            name,
          });
        });
      } while (after);
      return results;
    },
  },
};
