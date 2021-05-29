const axios = require("axios");
const get = require("lodash/get");

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
    },
    includeSubredditDetails: {
      type: "boolean",
      label: "Include subreddit details?",
      description:
        "If set to true, includes details on the subreddit in the emitted event.",
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
    _wereThingsPulled(redditThings) {
      const things = get(redditThings, "data.children");
      return things && things.length;
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
    async getNewHotSubredditPosts(
      subreddit,
      locale,
      showAllPosts,
      includeSubredditDetails,
      limit = 100
    ) {
      const params = {};
      if (showAllPosts) {
        params["show"] = "all";
      }
      params["g"] = locale;
      params["sr_detail"] = includeSubredditDetails;
      params["limit"] = limit;
      const hotPosts = await this._makeRequest({
        path: `/r/${subreddit}/hot`,
        params,
      });
      const thingsPulled = this._wereThingsPulled(hotPosts);
      return thingsPulled ? hotPosts.data.children : null;
    },
    async getNewSubredditLinks(before, subreddit, limit = 100) {
      const redditLinks = await this._makeRequest({
        path: `/r/${subreddit}/new`,
        params: {
          before,
          limit,
        },
      });
      const thingsPulled = this._wereThingsPulled(redditLinks);
      return thingsPulled ? redditLinks.data.children : null;
    },
    async getNewSubredditComments(
      subreddit,
      subredditPost,
      numberOfParents,
      depth,
      includeSubredditDetails,
      limit = 100
    ) {
      const [redditArticle, redditComments] = await this._makeRequest({
        path: `/r/${subreddit}/comments/article`,
        params: {
          article: subredditPost,
          context: numberOfParents,
          depth,
          limit,
          sort: "new",
          sr_detail: includeSubredditDetails,
          theme: "default",
          threaded: true,
          trucate: 0,
        },
      });
      const thingsPulled = this._wereThingsPulled(redditComments);
      return thingsPulled ? redditComments.data.children : null;
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
      const redditLinks = await this._makeRequest({
        path: `/user/${username}/submitted`,
        params,
      });
      const thingsPulled = this._wereThingsPulled(redditLinks);
      return thingsPulled ? redditLinks.data.children : null;
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
      const redditComments = await this._makeRequest({
        path: `/user/${username}/comments`,
        params,
      });
      const thingsPulled = this._wereThingsPulled(redditComments);
      return thingsPulled ? redditComments.data.children : null;
    },
    async searchSubreddits(after, query) {
      const params = {
        after,
        limit: 100,
        q: query,
        show_users: false,
        sort: "relevance",
        sr_detail: false,
        typeahead_active: false,
      };
      const subreddits = await this._makeRequest({
        path: `/subreddits/search`,
        params,
      });
      const thingsPulled = this._wereThingsPulled(subreddits);
      return thingsPulled ? subreddits.data.children : null;
    },
    async getAllSearchSubredditsResults(query) {
      let after = null;
      const results = [];
      do {
        const subreddits = await this.searchSubreddits(after, query);
        if (!subreddits) {
          console.log("No data available, skipping itieration");
          break;
        }
        after = subreddits[subreddits.length - 1].data.name;
        subreddits.forEach((subreddit) => {
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
