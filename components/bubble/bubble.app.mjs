import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bubble",
  propDefinitions: {
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID for the Bubble workflow to monitor",
    },
    thingId: {
      type: "string",
      label: "Thing ID",
      description: "The unique ID of the thing in the Bubble database to modify",
    },
    attributeToModify: {
      type: "string",
      label: "Attribute to Modify",
      description: "The name of the attribute of the thing to change",
      optional: true,
    },
    newValue: {
      type: "any",
      label: "New Value",
      description: "The new value for the specified attribute",
      optional: true,
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The query to search for a thing in the Bubble database",
    },
    searchParameters: {
      type: "object",
      label: "Search Parameters",
      description: "Optional parameters to refine the search results",
      optional: true,
    },
    thingAttributes: {
      type: "object",
      label: "Thing Attributes",
      description: "The attributes for the new thing to create in the Bubble database",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.appname}.bubbleapps.io/api/1.1/obj`;
    },

    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },

    async listenForWorkflow(opts = {}) {
      const {
        workflowId, ...otherOpts
      } = opts;
      if (!workflowId) {
        throw new Error("Workflow ID is required to listen for workflows.");
      }
      // Implement logic to listen for the workflow and emit an event
    },

    async modifyThingById(opts = {}) {
      const {
        thingId, attributeToModify, newValue, ...otherOpts
      } = opts;
      if (!thingId) {
        throw new Error("A Thing ID is required to modify a thing.");
      }
      const data = attributeToModify
        ? {
          [attributeToModify]: newValue,
        }
        : {};
      return this._makeRequest({
        method: "PATCH",
        path: `/${thingId}`,
        data,
        ...otherOpts,
      });
    },

    async searchForThings(opts = {}) {
      const {
        searchQuery, searchParameters, ...otherOpts
      } = opts;
      if (!searchQuery) {
        throw new Error("A search query is required to search for a thing.");
      }
      const params = {
        q: searchQuery,
        ...searchParameters,
      };
      return this._makeRequest({
        method: "GET",
        path: "/search",
        params,
        ...otherOpts,
      });
    },

    async createNewThing(opts = {}) {
      const {
        thingAttributes, ...otherOpts
      } = opts;
      if (!thingAttributes || typeof thingAttributes !== "object") {
        throw new Error("Thing attributes must be provided to create a new thing.");
      }
      return this._makeRequest({
        method: "POST",
        data: thingAttributes,
        ...otherOpts,
      });
    },
  },
  version: "0.0.{{ts}}",
};
