import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "onedesk",
  propDefinitions: {
    userType: {
      type: "string",
      label: "User Type",
      description: "Type of user or customer",
      optional: true,
      async options() {
        const { data: { userTypes } } = await this.getOrgInfo();
        return userTypes.map((type) => ({
          label: type.name,
          value: type.userType,
        }));
      },
    },
    itemType: {
      type: "string",
      label: "Item Type",
      description: "Type of the item",
      async options() {
        const { data: { itemTypes } } = await this.getOrgInfo();
        return itemTypes.map((type) => ({
          label: type.name,
          value: type.itemType,
        }));
      },
    },
    containerType: {
      type: "string",
      label: "Container Type",
      description: "Type of the space",
      async options() {
        const { data: { containerTypes } } = await this.getOrgInfo();
        return containerTypes.map((type) => ({
          label: type.name,
          value: type.containerType,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
      optional: true,
      async options() {
        const { data } = await this.listTeams();
        return data.map((team) => ({
          label: team.name,
          value: team.id,
        }));
      },
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "Id of the work item to post a comment on",
      async options() {
        const { data: { items } } = await this.searchItems();
        const { data: { items: workspaceItems } } = await this.getItemsByIds({
          data: {
            workItemIds: items,
          },
        });
        return workspaceItems.map((workspaceItem) => ({
          label: workspaceItem.name,
          value: workspaceItem.id,
        }));
      },
    },
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "The ID of the space or project",
      optional: true,
      async options() {
        const spaces = [];
        const { data: { items } } = await this.searchSpaces();
        for (const item of items) {
          const { data: space } = await this.getSpace({
            data: {
              id: item,
            },
          });
          spaces.push({
            label: space.name,
            value: space.id,
          });
        }
        return spaces;
      },
    },
    spaceName: {
      type: "string",
      label: "Space Name",
      description: "The name of the space or project",
      optional: true,
      async options() {
        const spaces = [];
        const { data: { items } } = await this.searchSpaces();
        for (const item of items) {
          const { data: space } = await this.getSpace({
            data: {
              id: item,
            },
          });
          spaces.push(space.name);
        }
        return spaces;
      },
    },
    parentIds: {
      type: "string[]",
      label: "Parent IDs",
      description: "Array of parent/portfolio IDs",
      optional: true,
      async options() {
        const portfolios = [];
        const { data: { items } } = await this.searchPortfolios();
        for (const item of items) {
          const { data: portfolio } = await this.getPortfolio({
            data: {
              id: item,
            },
          });
          portfolios.push({
            label: portfolio.name,
            value: portfolio.id,
          });
        }
        return portfolios;
      },
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the item",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    postType: {
      type: "string",
      label: "Post Type",
      description: "Type of comment",
      options: constants.POST_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.onedesk.com/rest/2.0";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _buildAuth(method, data, params) {
      if (method === "POST") {
        return {
          data: {
            ...data,
            authenticationToken: this._authToken(),
          },
        };
      }
      return {
        params: {
          ...params,
          token: this._authToken(),
        },
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        method,
        ...this._buildAuth(method, data, params),
        ...args,
      };
      return axios($, config);
    },
    getItemUpdates(args = {}) {
      return this._makeRequest({
        path: "/history/getItemUpdates",
        method: "POST",
        ...args,
      });
    },
    getOrgInfo(args = {}) {
      return this._makeRequest({
        path: "/organization/getOrgInfo",
        ...args,
      });
    },
    getSpace(args = {}) {
      return this._makeRequest({
        path: "/space/getItemById",
        method: "POST",
        ...args,
      });
    },
    getItem(args = {}) {
      return this._makeRequest({
        path: "/workitem/getItemDetails",
        ...args,
      });
    },
    getPortfolio(args = {}) {
      return this._makeRequest({
        path: "/portfolio/getItemById",
        method: "POST",
        ...args,
      });
    },
    getItemsByIds(args = {}) {
      return this._makeRequest({
        path: "/workitem/getItems",
        method: "POST",
        ...args,
      });
    },
    listTeams(args = {}) {
      return this._makeRequest({
        path: "/userteam/get",
        method: "POST",
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        path: "/user/create",
        method: "POST",
        ...args,
      });
    },
    createItem(args = {}) {
      return this._makeRequest({
        path: "/workitem/createWorkItem",
        method: "POST",
        ...args,
      });
    },
    createSpace(args = {}) {
      return this._makeRequest({
        path: "/space/create",
        method: "POST",
        ...args,
      });
    },
    createComment(args = {}) {
      return this._makeRequest({
        path: "/workitem/createComment",
        method: "POST",
        ...args,
      });
    },
    searchSpaces(args = {}) {
      return this._makeRequest({
        path: "/space/search",
        method: "POST",
        ...args,
      });
    },
    searchPortfolios(args = {}) {
      return this._makeRequest({
        path: "/portfolio/search",
        method: "POST",
        ...args,
      });
    },
    searchItems(args = {}) {
      return this._makeRequest({
        path: "/workitem/searchItems",
        method: "POST",
        ...args,
      });
    },
    updateItem(args = {}) {
      return this._makeRequest({
        path: "/workitem/updateWorkItem",
        method: "POST",
        ...args,
      });
    },
  },
};
