const axios = require("axios");
const get = require("lodash.get");
module.exports = {
  type: "app",
  app: "reddit",
  propDefinitions: {
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch.",
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username you'd like to watch.",
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
    wereLinksPulled(reddit_things) {
      const links = get(reddit_things, "data.children");
      return links && links.length;
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
      params["g"] = g;
      params["sr_detail"] = sr_detail;
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
