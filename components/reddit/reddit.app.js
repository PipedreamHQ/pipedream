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
    did4xxErrorOccurred(err) {
      return (
        get(err, "response.status") !== undefined &&
        get(err, "response.status") !== null &&
        err.response.status >= 400
      );
    },
    async getNewHotSubredditPosts(subreddit, g, show, sr_detail, limit = 100) {
      const params = {};
      if (show) {
        params["show"] = "all";
      }
      params["g"] = region;
      params["sr_detail"] = includeSubredditDetails;
      params["limit"] = limit;
      return await this._makeRequest({
        path: `/r/${subreddit}/hot`,
        params,
      });
    },
    async getNewSubredditLinks(before_link, subreddit, limit = 100) {
      return await this._makeRequest({
        path: `/r/${subreddit}/new`,
        params: {
          before: before_link,
          limit,
        },
      });
    },
    async getNewCommentsOrLinks(
      before,
      username,
      context,
      show,
      t,
      type,
      sr_detail,
      limit = 100
    ) {
      const params = {
        before,
        context,
        show: "given",
        sort: "new",
        t,
        type,
        sr_detail,
        limit,
      };

      return await this._makeRequest({
        path: `/user/${username}/comments`,
        params,
      });
    },
  },
};
