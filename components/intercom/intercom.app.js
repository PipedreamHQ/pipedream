const axios = require("axios");

module.exports = {
  type: "app",
  app: "intercom",
  methods: {
    _getBaseURL() {
      return "https://api.intercom.io";
    },
    _getHeader() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        Accept: "application/json",
      };
    },
    monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async getCompanies(lastCompanyCreatedAt) {
      let results = null;
      let starting_after = null;
      let done = false;
      const companies = [];
      while ((!results || results.data.pages.next) && !done) {
        if (results) starting_after = results.data.pages.next.starting_after;
        const config = {
          method: "GET",
          url: `${this._getBaseURL()}/companies${starting_after ? "?starting_after=" + starting_after : ""}`,
          headers: this._getHeader(),
        };
        results = await axios(config);
        for (const company of results.data.data) {
          if (company.created_at > lastCompanyCreatedAt)
            companies.push(company);
          else
            done = true;
        }
      }
      return companies;
    },
    async getConversation(id) {
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}/conversations/${id}`,
        headers: this._getHeader(),
      };
      return await axios(config);
    },
    async getEvents(user_id, nextURL = null) {
      let results = null;
      let since = null;
      const events = [];
      while (!results || results.data.pages.next) {
        if (results) nextURL = results.data.pages.next;
        const url = nextURL || `${this._getBaseURL()}/events?type=user&intercom_user_id=${user_id}`;
        const config = {
          method: "GET",
          url,
          headers: this._getHeader(),
        };
        results = await axios(config);
        for (const result of results.data.events) {
          events.push(result);
        }
        if (results.data.pages.since)
          since = results.data.pages.since;
      }
      return { events, since };
    },  
    async searchContacts(data, starting_after = null) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}/contacts/search${
          starting_after ? "?starting_after=" + starting_after : ""
        }`,
        headers: this._getHeader(),
        data,
      };
      return await axios(config);
    },
    async searchContacts(data) {
      let results = null;
      let starting_after = null;
      let config = null;
      const contacts = [];
      while (!results || results.data.pages.next) {
        if (results) starting_after = results.data.pages.next.starting_after;
        config = {
          method: "POST",
          url: `${this._getBaseURL()}/contacts/search${starting_after ? "?starting_after=" + starting_after : ""}`,
          headers: this._getHeader(),
          data,
        };
        results = await axios(config);
        for (const contact of results.data.data) {
          contacts.push(contact);
        }
      }
      return contacts;
    },
    async searchConversations(data) {
      let results = null;
      let starting_after = null;
      let config = null;
      const conversations = [];
      while (!results || results.data.pages.next) {
        if (results) starting_after = results.data.pages.next.starting_after;
        config = {
          method: "POST",
          url: `${this._getBaseURL()}/conversations/search${starting_after ? "?starting_after=" + starting_after : ""}`,
          headers: this._getHeader(),
          data,
        };
        results = await axios(config);
        for (const result of results.data.conversations) {
          conversations.push(result);
        }
      }
      return conversations;
    },  
  },
};