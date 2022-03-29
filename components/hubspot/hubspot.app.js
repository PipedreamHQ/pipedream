const axios = require("axios");

module.exports = {
  type: "app",
  app: "hubspot",
  propDefinitions: {
    lists: {
      type: "string[]",
      label: "Lists",
      description: "Select the lists to watch for new contacts.",
      withLabel: true,
      async options({
        prevContext, listType = "all",
      }) {
        const { offset = 0 } = prevContext;
        const params = {
          count: 250,
          offset,
        };
        let results;
        if (listType === "static") {
          results = await this.getStaticLists(params);
        } else if (listType === "dynamic") {
          results = await this.getDynamicLists(params);
        } else {
          results = await this.getLists(params);
        }
        const options = results.map((result) => {
          const {
            name: label,
            listId,
          } = result;
          return {
            label,
            value: listId,
          };
        });
        return {
          options,
          context: {
            offset: params.offset + params.count,
          },
        };
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
            stageId,
          } = result;
          return {
            label,
            value: JSON.stringify({
              label,
              value: stageId,
            }),
          };
        });
        return options;
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "Watch for new events concerning the object type specified.",
      async options() {
        return [
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
        ];
      },
    },
    objectIds: {
      type: "string[]",
      label: "Object",
      description: "Watch for new events concerning the objects selected.",
      async options(opts) {
        let objectType = null;
        if (opts.objectType == "company") objectType = "companies";
        else objectType = `${opts.objectType}s`;
        return this.createOptions(objectType);
      },
    },
    forms: {
      type: "string[]",
      label: "Form",
      description: "Watch for new submissions of the specified forms.",
      async options(prevContext) {
        const { offset } = prevContext;
        const params = {
          count: 50,
          offset: offset || 0,
        };
        const results = await this.getForms();
        const options = results.map((result) => {
          const {
            name: label,
            guid,
          } = result;
          return {
            label,
            value: JSON.stringify({
              label,
              value: guid,
            }),
          };
        });
        return {
          options,
          context: {
            offset: params.offset + params.count,
          },
        };
      },
    },
    propertyGroups: {
      type: "string[]",
      label: "Property Groups",
      description: "",
      reloadProps: true,
      async options({ objectType }) {
        const { results: groups } = await this.getPropertyGroups(objectType);
        return groups.map((group) => ({
          label: group.label,
          value: group.name,
        }));
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field.",
      async options({ prevContext }) {
        const { nextAfter } = prevContext;
        const {
          results: contacts,
          paging,
        } = await this.listObjectsInPage("contacts", nextAfter);
        return {
          options: contacts
            .filter(({ properties }) => properties.email)
            .map(({ properties }) => ({
              label: `${properties.firstname} ${properties.lastname}`,
              value: `${properties.email}`,
            })),
          context: {
            nextAfter: paging?.next?.after,
          },
        };
      },
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL returned after a file has been uploaded to a HubSpot Form",
      async options() {
        const { results: files } = await this.searchFiles();
        return files.map((file) => ({
          label: file.name,
          value: file.url,
        }));
      },
    },
  },
  methods: {
    _getBaseURL() {
      return "https://api.hubapi.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async makeGetRequest(endpoint, params = null) {
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
      };
      return (await axios(config)).data;
    },
    async makePostRequest({
      endpoint, params, data,
    }) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}${endpoint}`,
        headers: this._getHeaders(),
        params,
        data,
      };
      console.log("🚀 ~ file: hubspot.app.js ~ line 219 ~ config", config);
      return (await axios(config)).data;
    },
    getObjectName(objectType) {
      if (!objectType.endsWith("s")) {
        return objectType.toLowerCase();
      }
      if (objectType === "companies") {
        return "company";
      }
      return objectType.toLowerCase().slice(0, -1);
    },
    getObjectLabel(object, objectType) {
      const {
        id,
        properties,
      } = object;
      const objectName = this.getObjectName(objectType);
      switch (objectName) {
      case "company":
        return properties.name;
      case "contact":
        return `${properties.firstname} ${properties.lastname}`;
      case "deal":
        return properties.dealname;
      case "line_item":
        return properties.name;
      case "ticket":
        return properties.subject;
      case "quote":
        return properties.hs_title;
      case "owner":
        return object.email;
      case "call":
        return object.hs_call_title;
      default:
        return id;
      }
    },
    async searchCRM({
      object, ...data
    }) {
      const config = {
        method: "POST",
        url: `${this._getBaseURL()}/crm/v3/objects/${object}/search`,
        headers: this._getHeaders(),
        data,
      };
      return (await axios(config)).data;
    },
    async getBlogPosts(params) {
      return await this.makeGetRequest("/cms/v3/blogs/posts", params);
    },
    async getCalendarTasks(endDate) {
      const params = {
        startDate: Date.now(),
        endDate,
      };
      return await this.makeGetRequest("/calendar/v1/events/task", params);
    },
    async getContactProperties() {
      return await this.makeGetRequest("/properties/v1/contacts/properties");
    },
    async createPropertiesArray() {
      const allProperties = await this.getContactProperties();
      return allProperties.map((property) => property.name);
    },
    async getDealProperties() {
      return await this.makeGetRequest("/properties/v1/deals/properties");
    },
    async getDealStages() {
      return await this.makeGetRequest("/crm-pipelines/v1/pipelines/deal");
    },
    async getEmailEvents(params) {
      return await this.makeGetRequest("/email/public/v1/events", params);
    },
    async getEngagements(params) {
      return await this.makeGetRequest(
        "/engagements/v1/engagements/paged",
        params,
      );
    },
    async getEvents(params) {
      return await this.makeGetRequest("/events/v3/events", params);
    },
    async getForms(params) {
      return await this.makeGetRequest("/forms/v2/forms", params);
    },
    async getFormSubmissions(params) {
      const { formId } = params;
      delete params.formId;
      return await this.makeGetRequest(
        `/form-integrations/v1/submissions/forms/${formId}`,
        params,
      );
    },
    async getLists(params) {
      const { lists } = await this.makeGetRequest("/contacts/v1/lists", params);
      return lists;
    },
    async getStaticLists(params) {
      const { lists } = await this.makeGetRequest("/contacts/v1/lists/static", params);
      return lists;
    },
    async getDynamicLists(params) {
      const { lists } = await this.makeGetRequest("/contacts/v1/lists/dynamic", params);
      return lists;
    },
    async getListContacts(params, listId) {
      return await this.makeGetRequest(
        `/contacts/v1/lists/${listId}/contacts/all`,
        params,
      );
    },
    async getOwners(params) {
      return await this.makeGetRequest("/crm/v3/owners", params);
    },
    async listObjectsInPage(objectType, after, params) {
      return await this.makeGetRequest(`/crm/v3/objects/${objectType}`, {
        after,
        ...params,
      });
    },
    async getObjects(objectType) {
      const params = {
        limit: 100,
      };
      let results = null;
      const objects = [];
      while (!results || params.next) {
        results = await this.makeGetRequest(
          `/crm/v3/objects/${objectType}`,
          params,
        );
        if (results.paging) params.next = results.paging.next.after;
        else delete params.next;
        for (const result of results.results) {
          objects.push(result);
        }
      }
      return objects;
    },
    async getObject(objectType, objectId, properties) {
      const params = {
        properties: properties.join(","),
      };
      console.log("🚀 ~ file: hubspot.app.js ~ line 304 ~ getObject ~ params", params);

      return await this.makeGetRequest(
        `/crm/v3/objects/${objectType}/${objectId}`,
        params,
      );
    },
    async getContact(contactId, properties) {
      const params = {
        properties,
      };
      return await this.makeGetRequest(
        `/crm/v3/objects/contacts/${contactId}`,
        params,
      );
    },
    async createObject(objectType, properties) {
      return this.makePostRequest({
        endpoint: `/crm/v3/objects/${objectType}`,
        data: {
          properties,
        },
      });
    },
    async getPropertyGroups(objectType) {
      return await this.makeGetRequest(`/crm/v3/properties/${objectType}/groups`);
    },
    async getProperties(objectType) {
      return await this.makeGetRequest(`/crm/v3/properties/${objectType}`);
    },
    async getSchema(objectType) {
      return await this.makeGetRequest(`/crm/v3/schemas/${objectType}`);
    },
    async createOptions(referencedObjectType, opts = {}) {
      const {
        prevContext,
        page,
      } = opts;
      const { nextAfter } = prevContext;
      if (page !== 0 && !nextAfter) {
        return [];
      }
      const {
        paging,
        results,
        // TODO: change to this.listObjectsInPage
      } = await this.searchCRM({
        object: referencedObjectType,
        after: nextAfter,
      });
      return {
        options: results.map((object) => ({
          label: this.getObjectLabel(object, referencedObjectType),
          value: object.id,
        })),
        context: {
          nextAfter: paging?.next.after,
        },
      };
    },
    async getCompaniesOptions(opts) {
      return this.createOptions("COMPANY", opts);
    },
    async getContactsOptions(opts) {
      return this.createOptions("CONTACT", opts);
    },
    async getLineItemsOptions(opts) {
      return this.createOptions("LINE_ITEM", opts);
    },
    async getTicketsOptions(opts) {
      return this.createOptions("TICKET", opts);
    },
    async getQuotesOptions(opts) {
      return this.createOptions("QUOTE", opts);
    },
    async getCallsOptions(opts) {
      return this.createOptions("CALL", opts);
    },
    async getOwnersOptions(params) {
      const { results } = await this.getOwners(params);
      return results.map((object) => ({
        label: object.email,
        value: object.id,
      }));
    },
    async getOptionsMethod(objectType) {
      const objectName = this.getObjectName(objectType);
      switch (objectName) {
      case "owner":
        return (opts) => this.getOwnersOptions(opts);
      case "company":
        return (opts) => this.getCompaniesOptions(opts);
      case "contact":
        return (opts) => this.getContactsOptions(opts);
      case "deal":
        return (opts) => this.getDealsOptions(opts);
      case "line_item":
        return (opts) => this.getLineItemsOptions(opts);
      case "ticket":
        return (opts) => this.getTicketsOptions(opts);
      case "quote":
        return (opts) => this.getQuotesOptions(opts);
      case "call":
        return (opts) => this.getCallsOptions(opts);
      default:
        return undefined;
      }
    },
    async searchFiles(params) {
      return await this.makeGetRequest("/files/v3/files/search", params);
    },
    async getSignedUrl(fileId, params) {
      return await this.makeGetRequest(`/files/v3/files/${fileId}/signed-url`, params);
    },
    async addContactsToList(listId, emails) {
      return await this.makePostRequest({
        endpoint: `/contacts/v1/lists/${listId}/add`,
        data: {
          emails,
        },
      });
    },
  },
};
