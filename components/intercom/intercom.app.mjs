import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intercom",
  propDefinitions: {
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Users to watch for new events",
      async options({
        data = {
          query: {
            field: "role",
            operator: "=",
            value: "user",
          },
        },
      }) {
        const results = await this.searchContacts(data);
        return results.map((user) => ({
          label: user.name || user.id,
          value: user.id,
        }));
      },
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text of the note.",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The unique identifier for the tag which is given by Intercom. Eg. `7522907`.",
      async options() {
        const { data: tags } = await this.listTags();
        return tags.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The Intercom provisioned identifier for the conversation or the string `last` to reply to the last part of the conversation.",
      async options({ prevContext: { startingAfter } }) {
        if (startingAfter === null) {
          return [];
        }
        const response = await this.listConversations({
          params: {
            per_page: 20,
            starting_after: startingAfter,
          },
        });
        const options = response.conversations.map((conversation) => ({
          label: conversation.title || conversation.id,
          value: conversation.id,
        }));
        return {
          options,
          context: {
            startingAfter: response.pages.next?.starting_after || null,
          },
        };
      },
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The kind of message being created.",
      options({ type = "user" }) {
        if (type === "user") {
          return [
            "comment",
          ];
        }

        if (type === "admin") {
          return [
            "comment",
            "note",
          ];
        }
        return [];
      },
    },
    adminId: {
      type: "string",
      label: "Admin ID",
      description: "The unique identifier for the admin which is given by Intercom. Eg. `25`.",
      async options() {
        const { admins } = await this.listAdmins();
        return admins.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    teamAssigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "The `id` of the `team` which will be assigned the conversation. A conversation can be assigned both an admin and a team. Set `0` if you want this assign to no team (ie. Unassigned)",
      async options() {
        const { teams } = await this.getTeams();
        return teams.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Intercom-Version": "2.12",
      };
    },
    /**
    * Make a request to the Intercom API
    * @params {Object} opts - An object representing the configuration options for this method
    * @params {String} opts.method - The HTTP method
    * @params {String} [opts.url] - A full URL to be used in the API request. If not present,
    * endpoint is used.
    * @params {String} [opts.endpoint] - Endpoint to be after the base URL in the API request.
    * @params {Object} [opts.data] - The request body
    * @returns {*} The response may vary depending on the specific API request.
    */
    async makeRequest({
      url,
      endpoint,
      $ = this,
      ...opts
    }) {
      return axios($, {
        url: url ?? `https://api.intercom.io/${endpoint}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Paginate through a list of items and return the results
     * @params {String} itemType - The type of item being retrieved
     * (eg. "companies", "contacts", "conversation")
     * @params {String} method - The HTTP method
     * @params {Object} data - The request body
     * @params {Boolean} [isSearch=false] - If set to true, adds the word "search" to the
     * endpoint for search requests
     * @params {Interger} [lastCreatedAt] - Timestamp of the last relevant item created.
     * Used to retrieve only new results
     * @returns {Array} The complete list of paginated items
     */
    async paginate(itemType, method, data, isSearch = false, lastCreatedAt, resourceKey = "data") {
      let results = null;
      let done = false;
      let items = [];
      while ((!results || results?.pages?.next) && !done) {
        const startingAfter = results?.pages?.next?.starting_after || null;
        const search = isSearch && "/search" || "";
        const startingAfterParam = startingAfter && `?starting_after=${startingAfter}` || "";
        const endpoint = `${itemType}${search}${startingAfterParam}`;
        results = await this.makeRequest({
          method,
          endpoint,
          data,
        });
        if (lastCreatedAt) {
          for (const item of results[resourceKey]) {
            if (item.created_at > lastCreatedAt)
              items.push(item);
            else
              done = true;
          }
        } else {
          items = items.concat(results[resourceKey]);
          if (!startingAfter)
            done = true;
        }
      }
      return items;
    },
    /**
     * Get a list of companies
     * @params {Interger} [lastCompanyCreatedAt] - Timestamp of the creation date of the last
     * successfully retrieved company. If set, only companies created since this timestamp
     * will be returned.
     * @returns {Array} List of company objects
     */
    async getCompanies(lastCompanyCreatedAt) {
      return this.paginate("companies", "GET", null, false, lastCompanyCreatedAt);
    },
    /**
     * Get the current admin
     * @returns {Object} An admin object for the current authorized admin
     */
    async getAdmin($) {
      return this.makeRequest({
        endpoint: "me",
        $,
      });
    },
    /**
     * Get a conversation by id
     * @params {String} id - The identifier for the conversation as given by Intercom
     * @returns {Object} A conversation object matching the given id
     */
    async getConversation({
      conversationId, ...opts
    }) {
      return this.makeRequest({
        endpoint: `conversations/${conversationId}`,
        ...opts,
      });
    },
    /**
     * Get a list of teams
     * @returns {Array} List of team objects
     */
    getTeams() {
      return this.makeRequest({
        endpoint: "teams",
      });
    },
    /**
     * @params {String} userId - The id for the user who's events are being retrieved
     * @params {String} [nextUrl=null] - URL of the next page of events for a user.
     * Used to skip past results that have already been retrieved
     * @returns {Object} Object containing an array of events and the value of nextUrl
     */
    async getEvents(userId, nextUrl = null) {
      let results = null;
      let events = [];
      while (!results || results.pages.next) {
        const url = results?.pages?.next;
        const endpoint = `events?type=user&intercom_user_id=${userId}`;
        results = await this.makeRequest({
          method: "GET",
          url,
          endpoint,
        });
        if (results.pages.since) {
          nextUrl = results.pages.since;
        }
        events = events.concat(results.events);
      }
      return {
        events,
        nextUrl,
      };
    },
    /**
     * Get a contact by id
     * @params {String} id - The unique identifier for the contact which is given by Intercom
     * @returns {Object} A contact object matching the given id
     */
    async getContact(id, $) {
      return this.makeRequest({
        endpoint: `contacts/${id}`,
        $,
      });
    },
    /**
     * Search for contacts
     * @params {Ojbect} data - A query object used to search for contacts
     * @returns {Array} List of contacts matching search query
     */
    async searchContacts(data) {
      return this.paginate("contacts", "POST", data, true);
    },
    /**
     * Search for conversations
     * @params {Object} data - A query object used to search for conversations
     * @returns {Array} List of conversations matching search query
     */
    async searchConversations(data) {
      return this.paginate("conversations", "POST", data, true, null, "conversations");
    },
    /**
     * Create a note for a specific user
     * @params {String} userId - The unique identifier for the contact which is given by Intercom
     * @params {String} adminId - The unique identifier for the admin which is given by Intercom
     * @params {String} body - The text of the note.
     * @returns {Ojbect} The note object created by the request
     */
    async createNote(userId, adminId, body, $) {
      return this.makeRequest({
        method: "POST",
        endpoint: `contacts/${userId}/notes`,
        data: {
          body,
          admin_id: adminId,
        },
        $,
      });
    },
    searchContact(opts = {}) {
      return this.makeRequest({
        method: "POST",
        endpoint: "contacts/search",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this.makeRequest({
        method: "POST",
        endpoint: "contacts",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this.makeRequest({
        method: "PUT",
        endpoint: `contacts/${contactId}`,
        ...opts,
      });
    },
    /**
     * Create an incoming message from a user
     * @params {Object} data - The request body parameters including a `from` object and
     * the message content
     * @returns {Ojbect} The conversation object created by the request
     */
    async createConversation(data, $) {
      return this.makeRequest({
        method: "POST",
        endpoint: "conversations",
        data,
        $,
      });
    },
    listTags() {
      return this.makeRequest({
        endpoint: "tags",
      });
    },
    searchTickets(data) {
      return this.paginate("tickets", "POST", data, true, null, "tickets");
    },
    listConversations(args = {}) {
      return this.makeRequest({
        endpoint: "conversations",
        ...args,
      });
    },
    listAdmins() {
      return this.makeRequest({
        endpoint: "admins",
      });
    },
  },
};
