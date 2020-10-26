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
    async getBlogPosts(params) {
      return await this.makeGetRequest('/cms/v3/blogs/posts', params);
    },
    async getCalendarTasks(params) {
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
    async getEmailEvents(params) {
      return await this.makeGetRequest('/email/public/v1/events', params);
    },
    async getEngagements(params) {
      return await this.makeGetRequest('/engagements/v1/engagements/paged', params);
    },
    async getEvents(params) {
      return await this.makeGetRequest('/events/v3/events', params);
    },
    async getForms(params) {
      return await this.makeGetRequest('/forms/v2/forms', params);
    },
    async getFormSubmissions(id, params) {
      return await this.makeGetRequest(`/form-integrations/v1/submissions/forms/${id}`, params);
    },
    async getLists(params) {
      return await this.makeGetRequest('/contacts/v1/lists', params);
    },
    async getListContacts(list_id, params) {
      return await this.makeGetRequest(`/contacts/v1/lists/${list_id}/contacts/all`, params);
    },
    async getObjects(objectType, params) {
      return await this.makeGetRequest(`/crm/v3/objects/${objectType}`, params);
    },
    async getRecentlyUpdatedContacts(params) {
      return await this.makeGetRequest('/contacts/v1/lists/recently_updated/contacts/recent', params);
    },
    async getRecentlyUpdatedDeals(params) {
      return await this.makeGetRequest('/deals/v1/deal/recent/modified', params);
    },
  },
};