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
      // API docs: https://api.txtlocal.com/docs/messagereporting/getapimessagehistory
      const baseUrl = this._apiUrl();
      return `${baseUrl}/get_history_api`;
    },
    _contactGroupsUrl() {
      // API docs: https://api.txtlocal.com/docs/contactmanagement/getgroups
      const baseUrl = this._apiUrl();
      return `${baseUrl}/get_groups`;
    },
    _contactsUrl() {
      // API docs: https://api.txtlocal.com/docs/contactmanagement/getcontacts
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
    /**
     * Get the ID of the latest message sent via the [Send
     * SMS](https://api.txtlocal.com/docs/sendsms) API.
     *
     * @return {string} The message ID
     */
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
    /**
     * This generator function scans the history of messages sent via the [Send
     * SMS](https://api.txtlocal.com/docs/sendsms) API and yields each message
     * separately.
     *
     * It accepts optional parameter `lowerBoundMessageId` that will stop the
     * scan whenever it reaches a message with ID equal to the provided value of
     * the parameter.
     *
     * @param {object}  options Options to customize the operation
     * @param {string}  options.lowerBoundMessageId The ID of the message at
     * which the scan should stop
     * @yield {object}  The next message in the message history
     */
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
    /**
     * Retrieves the list of Contact Groups in the user's account, as provided
     * by the [Get
     * Groups](https://api.txtlocal.com/docs/contactmanagement/getgroups) API.
     *
     * @return {object} The response of the call to the Get Groups API
     */
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
    /**
     * This generator function scans a specific contact group and yields each
     * contact in such group separately.
     *
     * It requires a parameter `groupId` that identifies the contact group to
     * scan.
     *
     * @param {object}  options Options to customize the operation
     * @param {string}  options.groupId The ID of the contact group to scan for
     * contacts
     * @yield {object}  The next contact in the contact group
     */
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
