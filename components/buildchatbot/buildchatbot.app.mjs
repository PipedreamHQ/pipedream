import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "buildchatbot",
  propDefinitions: {
    chatbotId: {
      type: "string",
      label: "Chatbot ID",
      description: "The unique identifier for the chatbot",
      async options({ page }) {
        const { data } = await this.listChatbots({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          bot_id: value, bot_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.buildchatbot.ai/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listChatbots(opts = {}) {
      return this._makeRequest({
        path: "/user/get_all_user_bots/",
        ...opts,
      });
    },
    scrapSingleSiteURL({
      chatbotId, ...opts
    }) {
      return this._makeRequest({
        path: `/bot/${chatbotId}/scrape_single_website_url`,
        ...opts,
      });
    },
    attachSingleContentToBot({
      chatbotId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bot/${chatbotId}/content/attach`,
        ...opts,
      });
    },
    submitUserIdentificationForm({
      chatbotId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bot/${chatbotId}/user_identification`,
        ...opts,
      });
    },
    listQuestionAndAnswers(opts = {}) {
      return this._makeRequest({
        path: "/bot/chat-history/recent",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          links: { next },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = next;

      } while (hasMore);
    },
  },
};
