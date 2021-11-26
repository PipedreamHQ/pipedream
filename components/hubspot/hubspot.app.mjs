import axios from "axios";
import hubspotSDK from "@hubspot/api-client";

export default {
  type: "app",
  app: "hubspot",
  propDefinitions: {
    lists: {
      type: "string[]",
      label: "Lists",
      description: "Select the lists to watch for new contacts.",
      async options({ page }) {
        const count = 250;
        const offset = page * count;
        const params = {
          count,
          offset,
        };
        const results = await this.getLists(params);
        const options = results.map((result) => {
          const {
            name: label,
            listId,
          } = result;
          return {
            label,
            value: {
              label,
              value: listId,
            },
          };
        });
        return options;
      },
    },
    stages: {
      type: "string[]",
      label: "Stages",
      description: "Select the stages to watch for new deals in.",
      async options() {
        const results = await this.getDealStages();
        const options = results.results[0].stages.map((result) => {
          const {
            label,
            stageId: value,
          } = result;
          return {
            label,
            value,
          };
        });
        return options;
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Watch for new events concerning the object type specified.",
      options: [
        {
          label: "Companies",
          value: "company",
        },
        {
          label: "Contacts",
          value: "contact",
        },
        {
          label: "Deals",
          value: "deal",
        },
        {
          label: "Tickets",
          value: "ticket",
        },
      ],
    },
    objectIds: {
      type: "string[]",
      label: "Object",
      description: "Watch for new events concerning the objects selected.",
      async options(opts) {
        const objectType = (opts.objectType == "company")
          ? "companies"
          : `${opts.objectType}s`;
        const results = await this.getObjects(objectType);
        const options = results.map((result) => {
          const {
            id,
            properties,
          } = result;
          let label;
          switch (objectType) {
          case "companies":
            label = properties.name;
            break;
          case "contacts":
            label = `${properties.firstname} ${properties.lastname}`;
            break;
          case "deals":
            label = properties.dealname;
            break;
          case "tickets":
            label = properties.subject;
            break;
          }
          return {
            label,
            value: id,
          };
        });
        return options;
      },
    },
    forms: {
      type: "string[]",
      label: "Form",
      description: "Watch for new submissions of the specified forms.",
      async options({ page }) {
        const limit = 50;
        const offset = page * limit;
        const params = {
          limit,
          offset,
        };
        const results = await this.getForms(params);
        const options = results.map((result) => {
          const {
            name: label,
            guid: value,
          } = result;
          return {
            label,
            value,
          };
        });
        return options;
      },
    },
    channel: {
      type: "string",
      label: "Social Media Channel",
      async options() {
        const channels = await this.getPublishingChannels();
        const options = channels.map((channel) => {
          const {
            accountType,
            username,
            channelKey: value,
          } = channel;
          const label = `${accountType} ${username}`;
          return {
            label,
            value,
          };
        });
        return options;
      },
    },
  },
  methods: {
    _client() {
      return new hubspotSDK.Client({
        accessToken: this.$auth.oauth_access_token,
      });
    },
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async makeAxiosRequest(method, endpoint, params = null) {
      const config = {
        method,
        url: `https://api.hubapi.com${endpoint}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        params,
      };
      return (await axios(config)).data;
    },
    async makeRequest(method, path, body = null) {
      const client = this._client();
      return client.apiRequest({
        method,
        path,
        body,
      });
    },
    async searchCRM({
      object, ...data
    }) {
      const client = this._client();
      return (await client.crm[object].searchApi.doSearch(data)).body;
    },
    async getBlogPosts(params) {
      return (await this.makeRequest("GET", "/cms/v3/blogs/posts", params)).body;
    },
    async getCalendarTasks(endDate) {
      const params = {
        startDate: Date.now(),
        endDate,
      };
      return await this.makeAxiosRequest("GET", "/calendar/v1/events/task", params);
    },
    async getContactProperties() {
      return await this.makeAxiosRequest("GET", "/properties/v1/contacts/properties");
    },
    async createPropertiesArray() {
      const allProperties = await this.getContactProperties();
      return allProperties.map((property) => property.name);
    },
    async getDealProperties() {
      return await this.makeAxiosRequest("GET", "/properties/v1/deals/properties");
    },
    async getDealStages() {
      return await this.makeAxiosRequest("GET", "/crm-pipelines/v1/pipelines/deal");
    },
    async getEmailEvents(params) {
      return await this.makeAxiosRequest("GET", "/email/public/v1/events", params);
    },
    async getEngagements(params) {
      return await this.makeAxiosRequest(
        "GET",
        "/engagements/v1/engagements/paged",
        params,
      );
    },
    async getEvents(params) {
      return await this.makeAxiosRequest("GET", "/events/v3/events", params);
    },
    async getForms(params) {
      return await this.makeAxiosRequest("GET", "/forms/v2/forms", params);
    },
    async getFormSubmissions(params) {
      const { formId } = params;
      delete params.formId;
      return await this.makeAxiosRequest(
        "GET",
        `/form-integrations/v1/submissions/forms/${formId}`,
        params,
      );
    },
    async getLists(params) {
      const { lists } = await this.makeAxiosRequest("GET", "/contacts/v1/lists", params);
      return lists;
    },
    async getListContacts(params, listId) {
      return await this.makeAxiosRequest(
        "GET",
        `/contacts/v1/lists/${listId}/contacts/all`,
        params,
      );
    },
    async getObjects(objectType) {
      const client = this._client();
      return await client.crm[objectType].getAll();
    },
    async getContact(contactId, properties) {
      const params = {
        properties,
      };
      return await this.makeRequest(
        "GET",
        `/crm/v3/objects/contacts/${contactId}`,
        params,
      );
    },
    async getLineItem(lineItemId) {
      return await this.makeRequest("GET", `/crm/v3/objects/line_items/${lineItemId}`);
    },
    async getPublishingChannels() {
      return await this.makeAxiosRequest("GET", "/broadcast/v1/channels/setting/publish/current");
    },
    async getBroadcastMessages(params) {
      return await this.makeAxiosRequest("GET", "/broadcast/v1/broadcasts", params);
    },
    async getEmailSubscriptionsTimeline(params) {
      return await this.makeAxiosRequest("GET", "/email/public/v1/subscriptions/timeline", params);
    },
  },
};
