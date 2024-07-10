import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "onedesk",
  propDefinitions: {
    containerType: {
      type: "string",
      label: "Container Type",
      description: "Type of the container",
      optional: true,
      async options({
        filter = ({ visible }) => visible,
        mapper = ({ label }) => label,
      }) {
        const { data: containerTypes } = await this.getContainerTypes();
        return containerTypes
          .filter(filter)
          .map(mapper);
      },
    },
    parentPortfolioExternalIds: {
      type: "string[]",
      label: "Parent Portfolio External IDs",
      description: "Array of parent portfolio external IDs. Type the name of the parent portfolio to search for it.",
      useQuery: true,
      optional: true,
      async options({
        query, prevContext: { offset = 0 },
      }) {
        const { data } = await this.filterPortfolioDetails({
          data: {
            properties: [
              {
                property: "name",
                operation: "CONTAINS",
                value: query,
              },
            ],
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });

        return {
          options: data.map(({
            name: label,
            externalId: value,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    userType: {
      type: "string",
      label: "User Type",
      description: "Type of user or customer",
      optional: true,
      async options() {
        const { data: userTypes } = await this.getUserTypes();
        return userTypes.map(({ label }) => label);
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
      useQuery: true,
      optional: true,
      async options({
        query, prevContext: { offset = 0 },
      }) {
        const { data } = await this.filterTeamDetails({
          data: {
            properties: [
              {
                property: "name",
                operation: "CONTAINS",
                value: query,
              },
            ],
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });

        return {
          options: data.map(({
            name: label,
            externalId: value,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    invoice: {
      type: "string",
      label: "Invoice",
      description: "The invoice to search for",
      optional: true,
      async options({
        prevContext: { offset = 0 },
        mapper = ({ type }) => type,
      }) {
        const { data } = await this.filterInvoiceDetails({
          data: {
            properties: [
              {
                property: "creationTime",
                operation: constants.DATE_OPERATOR.LT.value,
                value: utils.getDateAfterToday(),
              },
            ],
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });

        return {
          options: data.map(mapper),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    conversationExternalId: {
      type: "string",
      label: "Conversation External ID",
      description: "The external ID of the conversation",
      async options({ prevContext: { offset = 0 } }) {
        const { data } = await this.filterConversationDetails({
          data: {
            properties: [
              {
                property: "createdTime",
                operation: constants.DATE_OPERATOR.LT.value,
                value: utils.getDateAfterToday(),
              },
            ],
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });

        return {
          options: data.map(({
            conversationId: value,
            content: label,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "Type of the item",
      optional: true,
      async options() {
        const { data: itemTypes } = await this.getItemTypes();
        return itemTypes.map(({ label }) => label);
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      optional: true,
      async options({ prevContext: { offset = 0 } }) {
        const { data } = await this.filterProjectDetails({
          data: {
            properties: [
              {
                property: "creationTime",
                operation: constants.DATE_OPERATOR.LT.value,
                value: utils.getDateAfterToday(),
              },
            ],
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
          },
        });

        return {
          options: data.map(({
            name: label,
            externalId: value,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the item",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    itemId: {
      type: "integer",
      label: "Item ID",
      description: "Id of the item",
      useQuery: true,
      async options({
        query, prevContext: { offset = 0 }, itemType,
      }) {
        const properties = [
          {
            property: "creationTime",
            operation: constants.DATE_OPERATOR.LT.value,
            value: utils.getDateAfterToday(),
          },
          {
            property: "name",
            operation: "CONTAINS",
            value: query,
          },
        ];

        const { data } = await this.filterItemDetails({
          data: {
            properties: properties.filter(({ value }) => value),
            isAsc: false,
            limit: constants.DEFAULT_LIMIT,
            offset,
            itemType: [
              itemType,
            ],
          },
        });

        return {
          options: data.map(({
            name: label,
            id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
    itemName: {
      type: "string",
      label: "Name",
      description: "Name of the item",
    },
    itemDescription: {
      type: "string",
      label: "Description",
      description: "Description of the item",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.onedesk.com/rest/public";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "OD-Public-API-Key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this.getHeaders(headers),
        ...args,
      });

      if (response?.data === null) {
        throw new Error(`No data returned from the API ${JSON.stringify(response, null, 2)}`);
      }

      if (response?.status === 429) {
        throw new Error("API rate limit exceeded");
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getContainerTypes(args = {}) {
      return this._makeRequest({
        path: "/organization/containerTypes",
        ...args,
      });
    },
    getUserTypes(args = {}) {
      return this._makeRequest({
        path: "/organization/userTypes",
        ...args,
      });
    },
    getItemTypes(args = {}) {
      return this._makeRequest({
        path: "/organization/itemTypes",
        ...args,
      });
    },
    filterPortfolioDetails(args = {}) {
      return this.post({
        path: "/portfolios/filter/details",
        ...args,
      });
    },
    filterTeamDetails(args = {}) {
      return this.post({
        path: "/teams/filter/details",
        ...args,
      });
    },
    filterInvoiceDetails(args = {}) {
      return this.post({
        path: "/invoices/filter/details",
        ...args,
      });
    },
    filterProjectDetails(args = {}) {
      return this.post({
        path: "/projects/filter/details",
        ...args,
      });
    },
    filterConversationDetails(args = {}) {
      return this.post({
        path: "/conversation-messages/filter/details",
        ...args,
      });
    },
    filterItemDetails(args = {}) {
      return this.post({
        path: "/items/filter/details",
        ...args,
      });
    },
    filterActivityDetails(args = {}) {
      return this.post({
        debug: true,
        path: "/activities/filter/details",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            data: {
              ...resourcesFnArgs?.data,
              limit: constants.DEFAULT_LIMIT,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        offset += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
