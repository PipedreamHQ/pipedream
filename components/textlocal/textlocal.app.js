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
    _contactGroupsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/get_groups`;
    },
    _contactsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/get_contacts`;
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
      if (messages.length === 0) {
        console.log("No messages sent so far");
        return;
      }

      const { id } = messages.shift();
      return id;
    },
    async *scanApiMessageHistory({ lowerBoundMessageId }) {
      let start = 0;
      let prevTotal;
      do {
        const {
          messages,
          total,
        } = await this._getApiMessageHistory({
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
    async getContactGroups() {
      const url = this._contactGroupsUrl();
      const params = this._baseRequestParams();
      const { data } = await axios.get(url, { params });
      return data;
    },
    async _getContactsInGroup({
      groupId,
      limit = 100,
      start = 0,
    }) {
      const url = this._contactsUrl();
      const params = {
        ...this._baseRequestParams(),
        group_id: groupId,
        limit,
        start,
      };
      const { data } = await axios.get(url, { params });
      return data;
    },
    async *scanContactGroup({ groupId }) {
      let start = 0;
      let prevNumContacts;
      do {
        const {
          contacts,
          num_contacts: numContacts,
        } = await this._getContactsInGroup({
          groupId,
        });
        prevNumContacts = prevNumContacts ? prevNumContacts : numContacts;

        for (const contact of contacts) {
          yield contact;
        }

        start += contacts.length + (numContacts - prevNumContacts);
        prevNumContacts = numContacts;
      } while (start < prevNumContacts);
    },
  },
};
