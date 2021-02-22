const axios = require("axios");
const get = require("lodash.get");

module.exports = {
  type: "app",
  app: "reddit",
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
      const links_length = get(reddit_things, "data.children.length");
      return (
        links_length !== null &&
        links_length !== undefined &&
        reddit_things.data.children.length > 0
      );
    },

    async getNewHotSubredditPosts(subreddit, g, show, sr_detail) {
      let params = new Object();
      if (show == "all") {
        params["show"] = show;
      }
      params["g"] = g;
      params["sr_detail"] = sr_detail;

      return await await this._makeRequest({
        path: `/r/${subreddit}/hot`,
        params: {
          limit: 10,
        },
      });
    },

    async getNewSubredditLinks(before_link, subreddit, limit) {
      return await await this._makeRequest({
        path: `/r/${subreddit}/new`,
        params: {
          before: before_link,
          limit: limit || 100,
        },
      });
    },
  },
};
