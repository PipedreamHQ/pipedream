const axios = require("axios");

module.exports = {
  type: "app",
  app: "textlocal",
  methods: {
    _apiUrl() {
      return "https://api.txtlocal.com";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiMessageHistoryUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/get_history_api`;
    },
    _baseRequestParams() {
      return {
        apikey: this._apiKey(),
      };
    },
    async _getApiMessageHistory({
      limit = 100,
      sortOrder = "desc",
      start = 0,
    }) {
      const url = this._apiMessageHistoryUrl();
      const params = {
        ...this._baseRequestParams(),
        limit,
        sort_order: sortOrder,
        start,
      };
      const { data } = await axios.get(url, { params });
      return data;
    },
    async getLatestMessageId() {
      const { messages } = await this._getApiMessageHistory({
        limit: 1,
      });
      const { id } = messages.shift();
      return id;
    },
    async *scanApiMessageHistory(lowerBoundMessageId) {
      const limit = 100;
      let start = 0;
      let prevTotal;
      do {
        const {
          messages,
          total,
        } = await this._getApiMessageHistory({
          limit,
          start,
        });
        prevTotal = prevTotal ? prevTotal : total;

        for (const message of messages) {
          if (message.id === lowerBoundMessageId) {
            return;
          }

          yield message;
        }

        start += messages.length + (total - prevTotal);
        prevTotal = total;
      } while (start < prevTotal);
    },
  },
};
