import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "insertchat",
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
          uid: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The unique identifier for the lead",
      async options({ page }) {
        const { data } = await this.listLeads({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          uid: value, first_name: firstName, last_name: lastName,
        }) => ({
          value,
          label: firstName || lastName
            ? (`${firstName} ${lastName}`).trim()
            : value,
        })) || [];
      },
    },
    chatSessionId: {
      type: "string",
      label: "Chat Session ID",
      description: "The unique identifier for the chat session",
      async options({
        chatbotId, page,
      }) {
        const { data } = await this.listChatSessions({
          chatbotId,
          page: page + 1,
        });
        return data?.map(({
          uid: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _appId() {
      return this.$auth.app_uid;
    },
    _baseUrl() {
      return "https://api.insertchat.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listChatbots(opts = {}) {
      return this._makeRequest({
        path: `/${this._appId()}/widgets`,
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: `/${this._appId()}/contacts`,
        ...opts,
      });
    },
    listChatSessions({
      chatbotId, ...opts
    }) {
      return this._makeRequest({
        path: `/${this._appId()}/chats/history/${chatbotId}?expand[0]=messages`,
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/${this._appId()}/contacts`,
        ...opts,
      });
    },
    deleteLead({
      leadId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/${this._appId()}/contacts/${leadId}`,
        ...opts,
      });
    },
    pushMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/embeds/messages",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...opts,
      });
    },
    async *paginate({
      fn,
      args,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let done, count = 0;
      do {
        const {
          data, meta,
        } = await fn(args);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
          done = args.params.page === meta.last_page;
          args.params.page++;
        }
      } while (!done);
    },
  },
};
