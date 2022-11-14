const _ = require("lodash");
const axios = require("axios");
const he = require("he");

module.exports = {
  type: "app",
  app: "stack_exchange",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "The StackExchange site for which questions are of interest",
      async options(context) {
        if (context.page !== 0) {
          // The `sites` API is not paginated:
          // https://api.stackexchange.com/docs/sites
          return {
            options: [],
          };
        }

        const url = this._sitesUrl();
        const { data } = await axios.get(url);
        const rawOptions = data.items.map((site) => ({
          label: site.name,
          value: site.api_site_parameter,
        }));
        const options = _.sortBy(rawOptions, [
          "label",
        ]);
        return {
          options,
        };
      },
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to search for in questions",
    },
    questionIds: {
      type: "string[]",
      label: "Questions",
      description: "Questions to monitor (max: 100)",
      useQuery: true,
      async options(context) {
        const q = context.query || "";
        const searchParams = {
          sort: "relevance",
          order: "desc",
          closed: false,
          q,
        };
        const url = this._advancedSearchUrl();
        const {
          items, hasMore,
        } = await this._propDefinitionsOptions(url, searchParams, context);

        const options = items.map((question) => ({
          label: he.decode(question.title),
          value: question.question_id,
        }));
        return {
          options,
          context: {
            hasMore,
          },
        };
      },
    },
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Users to monitor (max: 100)",
      useQuery: true,
      async options(context) {
        const inname = context.query || "";
        const searchParams = {
          sort: "reputation",
          order: "desc",
          inname,
        };
        const url = this._usersUrl();
        const {
          items, hasMore,
        } = await this._propDefinitionsOptions(url, searchParams, context);

        const options = items.map((user) => ({
          label: user.display_name,
          value: user.user_id,
        }));
        return {
          options,
          context: {
            hasMore,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.stackexchange.com/2.2";
    },
    _sitesUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/sites`;
    },
    _advancedSearchUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/search/advanced`;
    },
    _usersUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/users`;
    },
    _answersForQuestionsUrl(questionIds) {
      const baseUrl = this._apiUrl();
      const ids = questionIds.join(";");
      return `${baseUrl}/questions/${ids}/answers`;
    },
    _answersFromUsersUrl(userIds) {
      const baseUrl = this._apiUrl();
      const ids = userIds.join(";");
      return `${baseUrl}/users/${ids}/answers`;
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    async _propDefinitionsOptions(url, baseSearchParams, context) {
      const {
        hasMore = true,
        page,
        siteId,
      } = context;
      if (!hasMore) {
        return {
          items: [],
          hasMore: false,
        };
      }

      const searchParams = {
        ...baseSearchParams,
        site: siteId,
      };
      const searchPage = page + 1;  // The StackExchange API pages are 1-indexed
      const {
        items,
        has_more: nextPageHasMore,
      } = await this.getItemsForPage(url, searchParams, searchPage);

      return {
        items,
        hasMore: nextPageHasMore,
      };
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    advancedSearch(searchParams) {
      const url = this._advancedSearchUrl();
      return this.getItems(url, searchParams);
    },
    answersForQuestions(questionIds, searchParams) {
      const url = this._answersForQuestionsUrl(questionIds);
      return this.getItems(url, searchParams);
    },
    answersFromUsers(userIds, searchParams) {
      const url = this._answersFromUsersUrl(userIds);
      return this.getItems(url, searchParams);
    },
    async *getItems(url, baseParams) {
      let page = 1;
      let hasMore = false;
      do {
        const data = await this.getItemsForPage(url, baseParams, page);
        const { items } = data;

        if (items === undefined) {
          console.warn(`
            Unexpected response from ${url} (page ${page}):
            "items" is undefined.
            Query parameters: ${JSON.stringify(baseParams, null, 2)}.
          `);
          return;
        }

        if (items.length === 0) {
          console.log(`
            No new items found in ${url} for the following parameters:
            ${JSON.stringify(baseParams, null, 2)}
          `);
          return;
        }

        console.log(`Found ${items.length} new item(s) in ${url}`);
        for (const item of items) {
          yield item;
        }
        hasMore = data.has_more;
        ++page;
      } while (hasMore);
    },
    async getItemsForPage(url, baseParams, page) {
      const baseRequestConfig = this._makeRequestConfig();
      const params = {
        ...baseParams,
        page,
      };
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };
      const { data } = await axios.get(url, requestConfig);
      return data;
    },
  },
};
