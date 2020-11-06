const axios = require("axios");

module.exports = {
  type: "app",
  app: "hubspot",
  methods: {
    _getBaseURL() {
      return "https://api.hubapi.com"
    },
    _getHeaders() {
      return {
        'Authorization': `Bearer ${this.$auth.oauth_access_token}`,
        'Content-Type': 'application/json',
      };
    },
    monthAgo() {
      const now = new Date();
      const monthAgo = now;
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async makeGetRequest(endpoint, params=null) {
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
      }
      return (await axios(config)).data;
    },
    async searchCRM(data, object) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}/crm/v3/objects/${object}/search`,
        headers: this._getHeaders(),
        data,
      }
      return (await axios(config)).data;
    },
    async getBlogPosts(createdAfter) {
      const params = {
        limit: 100,
        createdAfter, // return entries created since event last ran
      };
      const blogposts = [];
      let total = 1;
      let count = 0;
      while (count < total) {
        let results = await this.makeGetRequest('/cms/v3/blogs/posts', params);
        total = results.total;
        if (results.paging) params.after = results.paging.next.after;
        for (const blogpost of results.results) {
          let createdAt = new Date(blogpost.created);
          blogposts.push(blogpost);
          count++;
        }
      }
      return blogposts;
    },
    async getCalendarTasks(endDate) {
      params = {
        startDate: Date.now(),
        endDate,
      };
      return await this.makeGetRequest('/calendar/v1/events/task', params);
    },
    async getContactProperties() {
      return await this.makeGetRequest('/properties/v1/contacts/properties');
    },
    async getDealProperties() {
      return await this.makeGetRequest('/properties/v1/deals/properties');
    },
    async getDealStages() {
      return await this.makeGetRequest('/crm-pipelines/v1/pipelines/deal');
    },
    async getEmailEvents(startTimestamp) {
      const params = {
        limit: 100,
        startTimestamp,
      };
      let hasMore = true;
      let done = false;
      const emailEvents = [];
      while (hasMore && !done) {
        let results = await this.makeGetRequest('/email/public/v1/events', params);
        hasMore = results.hasMore;
        if (hasMore) params.offset = results.offset;
        for (const emailEvent of results.events) {
          let createdAt = new Date(emailEvent.created);
          if (createdAt.getTime() > startTimestamp) {
            emailEvents.push(emailEvent);
          } else {
            done = true;
          }
        }
      }
      return emailEvents;
    },
    async getEngagements(createdAfter) {
      const params = {
        limit: 250,
      };
      let results = null;
      const engagements = [];
      while (!results || params.offset) {
        results = await this.makeGetRequest('/engagements/v1/engagements/paged', params);
        for (const result of results.results) {
          let createdAt = new Date(result.engagement.createdAt);
          if (createdAt.getTime() > createdAfter) {
            engagements.push(result);
          }
        }
        if (results.hasMore) params.offset = results.offset;
        else delete params.offset;
      }
      return engagements;
    },
    async getEvents(objectIds, objectType, occurredAfter) {
      const events = [];
      for (let objectId of objectIds) {
        objectId = JSON.parse(objectId);
        const params = {
          limit: 100,
          objectType,
          objectId: objectId.value,
          occurredAfter,
        };
        let results = null;
        while (!results || params.after) {
          results = await this.makeGetRequest('/events/v3/events', params);
          if (results.paging) params.after = results.paging.next.after;
          else delete params.after;
          for (const result of results.results) {
            result.label = objectId.label;
            events.push(result);
          }
        }
      }
      return events;
    },
    async getForms() {
      const params = {
        limit: 50,
        offset: 0,
      };
      let results = null;
      let done = false;
      const forms = [];
      while (!done) {
        results = await this.makeGetRequest('/forms/v2/forms', params);
        if (results.length < 1)
          done = true;
        else {
          params.offset = params.offset + params.limit;
          for (const form of results) {
            forms.push(form);
          }
        }
      }
      return forms;
    },
    async getFormSubmissions(forms, submittedAfter) {
      const params = {
        limit: 50,
      };
      const formSubmissions = [];
      for (let form of forms) {
        form = JSON.parse(form);
        let results = null;
        let done = false;
        while ((!results || params.after != undefined) && !done) {
          results = await this.makeGetRequest(`/form-integrations/v1/submissions/forms/${form.value}`, params);
          for (const result of results.results) {
            let submittedAt = new Date(result.submittedAt);
            if (submittedAt.getTime() > submittedAfter) {
              result.form = form;
              formSubmissions.push(result);
            } else {
              done = true; // don't need to continue if we've gotten to submissions already evaluated
            }
          }
          if (results.paging) params.after = results.paging.next.after;
          else delete params.after;
        }
        delete params.after;
      }
      return formSubmissions;
    },
    async getLists() {
      const params = {
        count: 100,
        offset: 0,
      };
      const lists = [];
      let hasMore = true;
      while (hasMore) {
        let results = await this.makeGetRequest('/contacts/v1/lists', params);
        hasMore = results["has-more"];
        if (hasMore)
          params.offset = params.offset + params.count;
        for (const list of results.lists) {
          lists.push(list);
        }
      }
      return lists;
    },
    async getListContacts(lists) {
      const contacts = [];
      for (let list of lists) {
        list = JSON.parse(list);
        const params = {
          count: 100,
        };
        let hasMore = true;
        while (hasMore) {
          let results = await this.makeGetRequest(`/contacts/v1/lists/${list.value}/contacts/all`, params);
          hasMore = results["has-more"];
          if (hasMore) params.vidOffset = results["vid-offset"];
          for (const contact of results.contacts) {
            contact.list = list;
            contacts.push(contact);
          }
        }
      }
      return contacts;
    },
    async getObjects(objectType) {
      const params = {
        limit: 100,
      };
      let results = null;
      const objects = [];
      while (!results || params.next) {
        results = await this.makeGetRequest(`/crm/v3/objects/${objectType}`, params);
        if (results.paging) params.next = results.paging.next.after;
        else delete params.next;
        for (const result of results.results) {
          objects.push(result);
        }
      }
      return objects;
    },
  },   
};