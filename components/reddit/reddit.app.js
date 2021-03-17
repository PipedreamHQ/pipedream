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
      optional: false,
      /* #region  subreddit prop's async options method     */
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
      /* #endregion */
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
    wereThingsPulled(reddit_things) {
      const things = get(reddit_things, "data.children");
      return things && things.length;
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
    async getNewSubredditComments(
      subreddit,
      subreddit_id36,
      context,
      depth,
      sr_detail,
      limit = 100
    ) {
      const resp = await this._makeRequest({
        path: `/r/${subreddit}/comments/article`,
        params: {
          article: subreddit_id36,
          context,
          depth,
          limit,
          sort: "new",
          sr_detail,
          theme: "default",
          threaded: true,
          trucate: 0,
        },
      });
      return resp[1];
    },
    async getNewUserLinks(
      before,
      username,
      context,
      t,
      sr_detail,
      limit = 100
    ) {
      const params = {
        before,
        context,
        show: "given",
        sort: "new",
        t,
        type: "links",
        sr_detail,
        limit,
      };

      return await this._makeRequest({
        path: `/user/${username}/submitted`,
        params,
      });
    },
    async getNewUserComments(
      before,
      username,
      context,
      t,
      sr_detail,
      limit = 100
    ) {
      const params = {
        before,
        context,
        show: "given",
        sort: "new",
        t,
        type: "comments",
        sr_detail,
        limit,
      };
      return await this._makeRequest({
        path: `/user/${username}/comments`,
        params,
      });
    },
    async searchSubreddits(after_link, query) {
      const params = {
        after: after_link,
        limit: 100,
        q: query,
        show_users: false,
        sort: "relevance",
        sr_detail: false,
        typeahead_active: false,
      };
      return await this._makeRequest({
        path: `/subreddits/search`,
        params,
      });
    },
    async getAllSearchSubredditsResults(query) {
      var after = null;
      var results = [];
      do {
        const reddit_things = await this.searchSubreddits(after, query);
        if (reddit_things && reddit_things.data) {
          after = reddit_things.data.after;
          if (reddit_things.data.children.length > 0) {
            reddit_things.data.children.forEach((reddit_link) => {
              results.push({
                title: reddit_link.data.title,
                name: reddit_link.data.name,
              });
            });
          }
        }
      } while (after);
      return results;
    },
  },
};
