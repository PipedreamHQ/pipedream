import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "asknicely",
  propDefinitions: {
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Add extra argments to send through extra custom data to help identify/filter/leaderboard customers. Multiple arguments can be sent with each request.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
    },
    segment: {
      type: "string",
      label: "Segment",
      description: "Set a customers segments.",
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.domain}.asknice.ly/api/v1`;
    },
    _getHeaders() {
      return {
        "X-apiKey": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts/add",
        ...args,
      });
    },
    getContact({
      key, search, ...args
    }) {
      return this._makeRequest({
        path: `contact/get/${search}/${key}`,
        ...args,
      });
    },
    getResponses({
      pageNumber, sort = "asc", sinceTime = 0, filter = "", ...args
    }) {
      return this._makeRequest({
        path: `responses/${sort}/50000/${pageNumber}/${sinceTime}/json/${filter}`,
        ...args,
      });
    },
    sendSurvey(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contact/trigger",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let lastPage = false;
      let count = 0;
      let pageNumber = 0;

      do {
        args.pageNumber = ++pageNumber;
        const {
          data,
          totalpages,
        } = await fn({
          params,
          ...args,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = (parseInt(totalpages) === pageNumber) || !parseInt(totalpages);
      } while (!lastPage);
    },
  },
};
