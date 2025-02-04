import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "vapi",
  propDefinitions: {
    assistantId: {
      type: "string",
      label: "Assistant ID",
      description: "ID of the assistant to start a conversation with or update",
      async options() {
        const assistants = await this.listAssistants({
          params: {
            limit: LIMIT,
          },
        });
        return assistants.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    squadId: {
      type: "string",
      label: "Squad ID",
      description: "ID of the squad to assign to the conversation",
      async options() {
        const squads = await this.listSquads({
          params: {
            limit: LIMIT,
          },
        });
        return squads.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phoneNumberId: {
      type: "string",
      label: "Phone Number ID",
      description: "ID of the phone number to use for the conversation",
      async options() {
        const phoneNumbers = await this.listPhoneNumbers({
          params: {
            limit: LIMIT,
          },
        });
        return phoneNumbers.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.vapi.ai";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, headers, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    startConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/call",
        ...opts,
      });
    },
    listAssistants(opts = {}) {
      return this._makeRequest({
        path: "/assistant",
        ...opts,
      });
    },
    listCalls(opts = {}) {
      return this._makeRequest({
        path: "/call",
        ...opts,
      });
    },
    listSquads(opts = {}) {
      return this._makeRequest({
        path: "/squad",
        ...opts,
      });
    },
    listPhoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/phone-number",
        ...opts,
      });
    },
    updateAssistant({
      assistantId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/assistant/${assistantId}`,
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file",
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
          meta: {
            current_page, last_page,
          },
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

        hasMore = !(current_page == last_page);

      } while (hasMore);
    },
  },
};
