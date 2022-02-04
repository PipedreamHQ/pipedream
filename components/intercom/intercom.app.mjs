import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intercom",
  propDefinitions: {
    userIds: {
      type: "string[]",
      label: "Users",
      description: "Users to watch for new events",
      async options() {
        const data = {
          query: {
            field: "role",
            operator: "=",
            value: "user",
          },
        };
        const results = await this.searchContacts(data);
        return results.map((user) => ({
          label: user.name || user.id,
          value: user.id,
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
    async makeRequest({
      method, url, endpoint, data, $,
    }) {
      const config = {
        method,
        url: url
          ? url
          : `https://api.intercom.io/${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          Accept: "application/json",
        },
        data,
      };
      return await axios($ || this, config);
    },
    async getCompanies(lastCompanyCreatedAt) {
      let results = null;
      let done = false;
      const companies = [];
      while ((!results || results.pages.next) && !done) {
        const startingAfter = results
          ? results.pages.next.starting_after
          : null;
        results = await this.makeRequest({
          method: "GET",
          endpoint: `companies${startingAfter
            ? "?starting_after=" + startingAfter
            : ""}`,
        });
        for (const company of results.data) {
          if (company.created_at > lastCompanyCreatedAt)
            companies.push(company);
          else
            done = true;
        }
      }
      return companies;
    },
    async getConversation(id) {
      return await this.makeRequest({
        method: "GET",
        endpoint: `conversations/${id}`,
      });
    },
    async getEvents(userId, nextUrl = null) {
      let results = null;
      let events = [];
      while (!results || results.pages.next) {
        const url = results
          ? results.pages.next
          : null;
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
    async searchContacts(data) {
      let results = null;
      let contacts = [];
      while (!results || results.pages.next) {
        const startingAfter = results
          ? results.pages.next.starting_after
          : null;
        const endpoint = `contacts/search${startingAfter
          ? "?starting_after=" + startingAfter
          : ""}`;
        results = await this.makeRequest({
          method: "POST",
          endpoint,
          data,
        });
        contacts = contacts.concat(results.data);
      }
      return contacts;
    },
    async searchConversations(data) {
      let results = null;
      let conversations = [];
      while (!results || results.pages.next) {
        const startingAfter = results
          ? results.pages.next.starting_after
          : null;
        const endpoint = `conversations/search${startingAfter
          ? "?starting_after=" + startingAfter
          : ""}`;
        results = await this.makeRequest({
          method: "POST",
          endpoint,
          data,
        });
        conversations = conversations.concat(results.conversations);
      }
      return conversations;
    },
  },
};
