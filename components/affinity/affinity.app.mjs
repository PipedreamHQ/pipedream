import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "affinity",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "The new organization to be added",
    },
    opportunityTitle: {
      type: "string",
      label: "Opportunity Title",
      description: "The title of the new opportunity",
    },
    opportunityDescription: {
      type: "string",
      label: "Opportunity Description",
      description: "The description of the new opportunity",
    },
    fieldName: {
      type: "string",
      label: "Field Name",
      description: "The name of the field that changed",
    },
    newValue: {
      type: "string",
      label: "New Value",
      description: "The new value of the field",
    },
    previousValue: {
      type: "string",
      label: "Previous Value",
      description: "The previous value of the field",
      optional: true,
    },
    personDetails: {
      type: "object",
      label: "Person Details",
      description: "The details of the new person entry",
    },
    entityIdentification: {
      type: "object",
      label: "Entity Identification",
      description: "The identification information of the entity to be updated",
    },
    updatedFields: {
      type: "object",
      label: "Updated Fields",
      description: "The fields to be updated",
    },
    opportunityDetails: {
      type: "object",
      label: "Opportunity Details",
      description: "The details of the new opportunity entry",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.affinity.co";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createEntity(entityDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/entities",
        data: entityDetails,
      });
    },
    async updateEntity(entityId, updatedFields) {
      return this._makeRequest({
        method: "PUT",
        path: `/entities/${entityId}`,
        data: updatedFields,
      });
    },
    async searchEntities(searchQuery) {
      return this._makeRequest({
        path: "/entities/search",
        params: {
          query: searchQuery,
        },
      });
    },
  },
};
