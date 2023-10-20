import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "salesflare",
  propDefinitions: {
    accountIds: {
      type: "integer[]",
      label: "Account IDs",
      description: "Array of account IDs",
      optional: true,
      async options({ prevContext }) {
        return utils.asyncPropHandler({
          resourceFn: this.getAccounts,
          page: prevContext?.page || 0,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    contactId: {
      type: "integer",
      label: "Contact ID",
      description: "Contact ID",
      async options({ prevContext }) {
        return utils.asyncPropHandler({
          resourceFn: this.getContacts,
          page: prevContext?.page || 0,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    userId: {
      type: "integer",
      label: "Owner ID",
      description: "Owner ID",
      optional: true,
      async options({ prevContext }) {
        return utils.asyncPropHandler({
          resourceFn: this.getUsers,
          page: prevContext?.page || 0,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    opportunityId: {
      type: "integer",
      label: "Opportunity ID",
      description: "Opportunity ID",
      optional: true,
      async options({ prevContext }) {
        return utils.asyncPropHandler({
          resourceFn: this.getOpportunities,
          page: prevContext?.page || 0,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    personId: {
      type: "integer",
      label: "Person ID",
      description: "Person ID",
      optional: true,
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getPeople,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    currency: {
      type: "integer",
      label: "Currency",
      description: "Currency",
      optional: true,
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getCurrencies,
          labelVal: {
            label: "iso",
            value: "id",
          },
        });
      },
    },
    pipelineId: {
      type: "integer",
      label: "Pipeline ID",
      description: "Pipeline ID",
      optional: true,
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getPipelines,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    pipelineStageId: {
      type: "integer",
      label: "Pipeline Stage ID",
      description: "Pipeline Stage ID",
      optional: true,
      async options() {
        return utils.asyncPropHandler({
          resourceFn: this.getPipelineStages,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    workflowId: {
      type: "integer",
      label: "Workflow ID",
      description: "Workflow ID",
      async options({ prevContext }) {
        return utils.asyncPropHandler({
          resourceFn: this.getWorkflows,
          page: prevContext?.page || 0,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    city: {
      type: "string",
      label: "City",
      description: "City (address)",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country (address)",
      optional: true,
    },
    stateRegion: {
      type: "string",
      label: "State Region",
      description: "State region (address)",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street (address)",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip (address)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email. Max `1000` characters",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number",
      optional: true,
    },
    socialProfiles: {
      type: "string[]",
      label: "Social Profiles",
      description: "Social profile links.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags",
      optional: true,
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "Links",
      optional: true,
    },
    custom: {
      type: "object",
      label: "Custom",
      description: "Custom fields",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Any search string.",
      optional: true,
    },
    details: {
      type: "boolean",
      label: "Details",
      description: "Returns more detailed results, defaults to `true`",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.salesflare.com${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async getOpportunities(args = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getPeople(args = {}) {
      return this._makeRequest({
        path: "/persons",
        ...args,
      });
    },
    async getPipelines(args = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...args,
      });
    },
    async getPipelineStages(args = {}) {
      return this._makeRequest({
        path: "/stages",
        ...args,
      });
    },
    async getTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    async getWorkflows(args = {}) {
      return this._makeRequest({
        path: "/workflows",
        ...args,
      });
    },
    async getCurrencies(args = {}) {
      return this._makeRequest({
        path: "/currencies",
        ...args,
      });
    },
    async addContactsToAccount({
      accountId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}/contacts`,
        method: "POST",
        ...args,
      });
    },
    async addUsersToAccount({
      accountId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}/users`,
        method: "POST",
        ...args,
      });
    },
    async createAccount(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        method: "POST",
        ...args,
      });
    },
    async updateAccount({
      accountId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/accounts/${accountId}`,
        method: "PUT",
        ...args,
      });
    },
    async createCall(args = {}) {
      return this._makeRequest({
        path: "/calls",
        method: "POST",
        ...args,
      });
    },
    async createMeeting(args = {}) {
      return this._makeRequest({
        path: "/meetings",
        method: "POST",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    async updateContact({
      contactId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
    async createInternalNote(args = {}) {
      return this._makeRequest({
        path: "/messages",
        method: "POST",
        ...args,
      });
    },
    async createOpportunity(args = {}) {
      return this._makeRequest({
        path: "/opportunities",
        method: "POST",
        ...args,
      });
    },
    async updateOpportunity({
      opportunityId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}`,
        method: "PUT",
        ...args,
      });
    },
    async createTask(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "POST",
        ...args,
      });
    },
    async removeContactFromWorkflow({
      workflowId,
      contactId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/workflows/${workflowId}/audience/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
