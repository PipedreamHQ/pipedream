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
          value: parseInt(item.id),
        }));
      },
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "Use this field to specify the sender name for your message. This must be at least 3 characters in length but no longer than 11 alphanumeric characters or 13 numeric characters. If this is excluded it will use the default sender name configured on your account",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message content. This parameter should be no longer than 765 characters. See Helpful Information for message length details. The message also must be URL Encoded to support symbols like &.",
    },
    numbers: {
      type: "string",
      label: "Numbers",
      description: "Comma-delimited list of mobile numbers in international format (i.e. 447123456789). Maximum of 10,000 numbers and error code 33 will be returned if exceeded.",
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
      description: "This parameter can be used in place of the numbers parameter in order to send to an entire contact group. This parameter should contain the ID of the relevant group, which can found either within Messenger (in the \"Reports\" - \"Advanced Reports\" - \"List of Group ID's\" section) or by running the get_groups command. Additionally group 5 contains \"contacts\" and group 6 contains \"opt-outs\".",
      async options() {
        const { groups } = await this.getGroups();
        return groups.map((item) => ({
          label: item.name,
          value: parseInt(item.id),
        }));
      },
    },
    simpleReply: {
      type: "boolean",
      label: "Simple Reply",
      default: true,
      description: "Set to true to enable the Simple Reply Service for the message. This will override any sender value, as a Simple Reply Service number will be used instead.",
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "This parameter can be used to specify a schedule date/time for your message, which should be provided in Unix timestamp format. Times should be provided in GMT.",
    },
    receiptUrl: {
      type: "string",
      label: "Receipt URL",
      description: "Use this field to specify an alternative URL to which the delivery receipt(s) will be sent. See handling receipts documentation.",
    },
    custom: {
      type: "string",
      label: "Custom",
      description: "This value will be set against the message batch and will passed back in the delivery receipts. This allows you to match delivery receipts to their corresponding messages.",
    },
    optouts: {
      type: "boolean",
      label: "Optouts",
      default: true,
      description: "Can be set to true in order to check against your own opt-outs list and Textlocal's global opt-outs database. Your message will not be sent to numbers within these lists. If not provided defaults to false.",
    },
    validity: {
      type: "string",
      label: "Validity",
      description: "Can be set, up to 72 hours in advance, to say after which time, you don't want the message delivered. This should be in a Unix timestamp format.",
    },
    unicode: {
      type: "boolean",
      label: "Unicode",
      default: true,
      description: "Set this value to true to specify that your message body will contain unicode characters. See Encoding/Decoding Unicode Documentation",
    },
    trackingLinks: {
      type: "boolean",
      label: "Tracking Links",
      default: true,
      description: "Set this value to true to specify that the message contains links and they should be converted to short links (trackable in messenger), Please note that links must be url encoded before being placed into the message",
    },
    test: {
      type: "boolean",
      label: "Test",
      default: true,
      description: "Set this field to true to enable test mode, no messages will be sent and your credit balance will be unaffected. If not provided defaults to false",
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
      return axios($ ?? this, config);
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
      const data = await this._makeRequest({
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

      return this._makeRequest({
        params,
        method: "GET",
        path: "/get_contacts",
      });
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
    async sendSMS({ params }) {
      return this._makeRequest({
        method: "POST",
        path: "/send",
        params,
      });
    },
  },
};
