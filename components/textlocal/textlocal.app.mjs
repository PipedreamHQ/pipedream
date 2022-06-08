import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "textlocal",
  propDefinitions: {
    inboxId: {
      type: "integer",
      label: "Inbox Id",
      description: "The id of the inbox",
      async options() {
        const { inboxes } = await this.getInboxes();
        return inboxes.map((item) => ({
          label: item.number,
          value: item.id,
        }));
      },
    },
    number: {
      type: "string",
      label: "Number",
      description: "The mobile number in international format (i.e. 447123456789).",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name to be assigned to this contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name to be assigned to this contact.",
    },
    custom1: {
      type: "string",
      label: "Custom 1",
      description: "A custom1 to be assigned to this contact.",
    },
    custom2: {
      type: "string",
      label: "Custom 2",
      description: "A custom2 to be assigned to this contact.",
    },
    custom3: {
      type: "string",
      label: "Custom 3",
      description: "A custom3 to be assigned to this contact.",
    },
    groupId: {
      type: "integer",
      label: "Group Id",
      description: "The id of the group",
      async options() {
        const { groups } = await this.getGroups();
        return groups.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.txtlocal.com";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $, url, path, params, ...otherConfig
    }) {
      const config = {
        url: url || (this._apiUrl() + path),
        params: {
          apikey: this._apiKey(),
          ...params,
        },
        ...otherConfig,
      };
      return axios($ || this, config);
    },

    async _getApiMessageHistory({
      limit = 100,
      sortOrder = "desc",
      start = 0,
    }) {
      const params = {
        limit,
        sort_order: sortOrder,
        start,
      };
      const data = await axios(this, {
        path: "/get_history_api",
        params,
      });
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
        prevTotal = prevTotal
          ? prevTotal
          : total;

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
    async getGroups() {
      return this._makeRequest({
        method: "GET",
        path: "/get_groups",
      });
    },
    async _getContactsInGroup({
      groupId,
      limit = 100,
      start = 0,
    }) {
      const params = {
        group_id: groupId,
        limit,
        start,
      };

      const { data } = this._makeRequest({
        params,
        method: "GET",
        path: "/get_contacts",
      });

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
        prevNumContacts = prevNumContacts
          ? prevNumContacts
          : numContacts;

        for (const contact of contacts) {
          yield contact;
        }

        start += contacts.length + (numContacts - prevNumContacts);
        prevNumContacts = numContacts;
      } while (start < prevNumContacts);
    },
    async *paginate({
      fn, params,
    }) {
      const limit = 1000;
      let start = 0;
      let length;
      do {
        const {
          messages,
          num_messages,
        } = await fn({
          params: {
            start,
            limit,
            ...params,
          },
        });

        if (messages) {
          length = num_messages;

          for (const message of messages) {
            yield message;
          }

          start += limit;
        }

      } while (length === limit);
    },
    async getInboxes() {
      return this._makeRequest({
        method: "GET",
        path: "/get_inboxes",
      });
    },
    async getInboxMessages({
      $, ...params
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/get_messages",
        params,
      });
    },
    async createContact({ params }) {
      return this._makeRequest({
        method: "POST",
        path: "/create_contacts_bulk",
        params,
      });
    },
  },
};
