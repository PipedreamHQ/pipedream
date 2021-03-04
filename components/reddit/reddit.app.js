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
      useQuery: true,
      async options(context) {
        const options = [];
        let results = [];
        results = await this.searchSubreddit(context.prevContext, context.query); 
                        //eventually context.prevContext will hold Reddit's after, context.query the user entered value
                        //for the prop
        for (const form of results) {
          options.push({ label: form.name, value: form.id });
        }        
        return {
          options,
          context: { prevContext: "1" }, //just sending a value in the prevContext object
        };
      },
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
      };cd..

      return await this._makeRequest({
        path: `/user/${username}/comments`,
        params,
      });
    },
    async searchSubreddit(after,query) {
      const params = {
        after,
        limit: 100,
        q: query,
        show_users: false,
        sort: "relevance",
        sr_detail: false,
        typeahead_active: false,
      };

      
      return [{
          name: `first ${query}`,
          value: "-_-"
        },
        {
          name: "second",
          value: "-_-"
        }];//I reduced the code to these contact value for I am getting a null error when pd dev,
            //i expect to use query as a parameter for the Reddit API, and after for pagination when eeded
      /*return await this._makeRequest({
        path: `/subreddits/search`,
        params,
      });*/
    },    
  },
};
