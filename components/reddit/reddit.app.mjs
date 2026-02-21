import { axios } from "@pipedream/platform";
import retry from "async-retry";
import get from "lodash/get.js";
import isNil from "lodash/isNil.js";
import qs from "qs";

export default {
  type: "app",
  app: "reddit",
  propDefinitions: {
    thingId: {
      type: "string",
      label: "Thing ID",
      description: "[Fullname](https://www.reddit.com/dev/api/#fullnames) of parent thing",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "One of: `relevance`, `activity`",
      options: [
        "relevance",
        "activity",
      ],
      optional: true,
    },
    subredditPost: {
      type: "string",
      label: "Post",
      description: "Select a subreddit post or enter a custom expression to reference a specific Post ID in [base36](http://en.wikipedia.org/wiki/Base36) (for example, `15bfi0`).",
      optional: false,
      useQuery: true,
      withLabel: true,
      async options({
        subreddit,
        query,
        prevContext,
      }) {
        const params = {
          limit: 50,
          after: prevContext?.after,
        };
        let links = [];

        if (query) {
          links = await this.searchSubredditLinks(
            get(subreddit, "value", subreddit),
            {
              ...params,
              q: query,
            },
          );
        } else {
          links = await this.getNewSubredditLinks(
            get(subreddit, "value", subreddit),
            params,
          );
        }

        const posts = get(links, "data.children", []);
        const options = posts.map((item) => ({
          label: item.data.title,
          value: item.data.id,
        }));

        return {
          options,
          context: {
            after: posts?.[posts.length - 1]?.data?.name,
          },
        };
      },
    },
    after: {
      type: "string",
      label: "After",
      description: "Only one of `after` and `before` should be specified. These indicate the [fullname](https://www.reddit.com/dev/api/#fullnames) of an item in the listing to use as the anchor point of the slice.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Only one of `after` and `before` should be specified. These indicate the [fullname](https://www.reddit.com/dev/api/#fullnames) of an item in the listing to use as the anchor point of the slice.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The number of items already seen in this listing. On the html site, the builder uses this to determine when to give values for `before` and `after` in the response.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Default to 25. The maximum number of items desired",
      min: 1,
      max: 100,
      optional: true,
    },
    subreddit: {
      type: "string",
      label: "Subreddit",
      description: "The subreddit you'd like to watch.",
      useQuery: true,
      withLabel: true,
      async options({
        query,
        prevContext,
      }) {
        if (!query) {
          return [];
        }
        const res = await this.searchSubreddits({
          after: prevContext?.after,
          q: query,
          limit: 30,
          show_users: false,
          sort: "relevance",
          sr_detail: false,
          typeahead_active: false,
        });

        const subreddits = get(res, "data.children", []);
        const options = subreddits.map((subreddit) => ({
          label: subreddit.data.title,
          value: subreddit.data.display_name,
        }));

        return {
          options,
          context: {
            after: get(subreddits, `${subreddits.length - 1}.data.name`),
          },
        };
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
      options: [
        "hour",
        "day",
        "week",
        "month",
        "year",
        "all",
      ],
      default: "all",
      optional: true,
    },
    includeSubredditDetails: {
      type: "boolean",
      label: "Include subreddit details?",
      description: "If set to `true`, subreddit details will be expanded/included.",
      optional: true,
    },
    numberOfParents: {
      type: "integer",
      label: "Number of Parents",
      description: "When set to `0`, it will only contain the new comment. Otherwise, it will also contain the parents of the comment up to the number indicated in this property.",
      optional: true,
      min: 0,
      max: 8,
    },
    depth: {
      type: "integer",
      label: "Depth",
      description: "If set to `1`, it will include, in the emitted event, only new comments that are direct children to the subreddit pointed by \"subredditPost\". Furthermore, \"depth\" determines the maximum depth of children, within the related subreddit comment tree, of new comments to be included in said emitted event.",
      optional: true,
    },
  },
  methods: {
    _getAxiosParams(opts) {
      const res = {
        ...opts,
        url: this._apiUrl() + opts.path + this._getQuery(opts.params),
        headers: this._getHeaders(),
        data: opts.data && qs.stringify(opts.data),
      };
      return res;
    },
    _getQuery(params) {
      if (!params) {
        return "";
      }

      let query = "?";
      const keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++) {
        // Explicity looking for nil values to avoid false negative for Boolean(false)
        if (!isNil(params[keys[i]])) {
          query += `${keys[i]}=${params[keys[i]]}&`;
        }
      }

      // It removes the last string char, it can be ? or &
      return query.substr(0, query.length - 1);
    },
    _getHeaders() {
      return {
        "authorization": `Bearer ${this._accessToken()}`,
      };
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://oauth.reddit.com";
    },
    checkErrors(data) {
      if (get(data, "json.errors.length", 0) > 0) {
        throw new Error(data.json.errors.map((err) => get(
          err,
          "[1]",
          err,
        )));
      }
    },
    async _makeRequest({
      $ = this, ...opts
    }) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._accessToken()}`;
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ?
        "" :
        "/"}${path}`;
      return axios($, opts);
    },
    _isRetriableStatusCode(statusCode) {
      return [
        408,
        429,
        500,
      ].includes(statusCode);
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
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${err.response.statusText}
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
      limit = 100,
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
        }));
    },
    async searchSubredditLinks(subreddit, opts) {
      const params = {
        limit: 100,
        ...opts,
      };

      return await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/search`,
          params: {
            ...params,
            restrict_sr: true,
          },
        }));
    },
    async getNewSubredditLinks(subreddit, opts) {
      const params = {
        limit: 100,
        ...opts,
      };
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/new`,
          params,
        }));
    },
    async getNewSubredditComments(
      subreddit,
      subredditPost,
      numberOfParents,
      depth,
      includeSubredditDetails,
      limit = 100,
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
        truncate: 0,
      };

      const [
        ,
        redditComments,
      ] = await this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/comments/article`,
          params,
        }));
      return redditComments;
    },
    async getNewUserLinks(
      before,
      username,
      numberOfParents,
      timeFilter,
      includeSubredditDetails,
      limit = 100,
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
        }));
    },
    async getNewUserComments(
      before,
      username,
      numberOfParents,
      timeFilter,
      includeSubredditDetails,
      limit = 100,
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
        }));
    },
    async getNewSavedPosts(
      before,
      username,
      timeFilter,
      includeSubredditDetails,
      limit = 100,
    ) {
      const params = {
        before,
        show: "given",
        sort: "new",
        t: timeFilter,
        sr_detail: includeSubredditDetails,
        limit,
      };
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/user/${username}/saved`,
          params,
        }));
    },
    async searchSubreddits(params) {
      const redditCommunities = await this._withRetries(() =>
        this._makeRequest({
          path: "/subreddits/search",
          params,
        }));
      return redditCommunities;
    },
    async getAllSearchSubredditsResults(query) {
      const results = [];
      let after = null;
      do {
        const redditCommunities = await this.searchSubreddits({
          after,
          q: query,
          limit: 100,
          show_users: false,
          sort: "relevance",
          sr_detail: false,
          typeahead_active: false,
        });
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
          const {
            title,
            display_name: displayName,
          } = subreddit.data;
          results.push({
            title,
            displayName,
          });
        });
      } while (after);
      return results;
    },
    async getSubredditByName(name) {
      return this._withRetries(() =>
        this._makeRequest({
          path: "/api/info",
          params: {
            id: name,
          },
        }));
    },
    async getComment({
      id: comment, article, subreddit,
    }) {
      return this._withRetries(() =>
        this._makeRequest({
          path: `/r/${subreddit}/comments/${article}`,
          params: {
            comment,
          },
        }));
    },
    getPrivateMessages(opts = { }) {
      return this._withRetries(() =>
        this._makeRequest({
          path: "/message/inbox",
          ...opts,
        }));
    },
  },
};
