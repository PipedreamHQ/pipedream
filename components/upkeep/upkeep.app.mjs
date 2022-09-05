import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "upkeep",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Title of the purchase order",
    },
    description: {
      type: "string",
      label: "Purchase Order Description",
      description: "Description of the purchase order",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the request. `0`,`1`,`2`,`3`. `0` being lowest",
      optional: true,
    },
    respectivePartQuantityUsed: {
      type: "integer[]",
      label: "Respective Part Quantities",
      description: "The respective quantities of each part included in the parts array",
      optional: true,
    },
    vendorId: { //cannot fetch vendors, it is possible only in enterprise plan. I did not use options here.
      type: "string",
      label: "Vendor",
      description: "The ID of the vendor",
      optional: true,
    },
    purchaseOrderId: {
      type: "string",
      label: "Purchase Order Id",
      description: "Id of the purchase order to be updated",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getPurchaseOrders,
          page,
          labelVal: {
            label: "title",
            value: "id",
          },
        });
      },
    },
    categoryId: {
      type: "string",
      label: "Category",
      description: "The category of the purchase order.",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getCategories,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    locationId: {
      type: "string",
      label: "Location",
      description: "Location Id",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getLocations,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    assetId: {
      type: "string",
      label: "Asset",
      description: "Asset Id",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getAssets,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    teamId: {
      type: "string",
      label: "Team",
      description: "Team Id",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getTeams,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "User Id",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getUsers,
          page,
          labelVal: {
            label: (user) => `${user.firstName} ${user.lastName}`,
            value: "id",
          },
        });
      },
    },
    parts: {
      type: "string[]",
      label: "Parts",
      description: "An array of Part IDs to include with the work order",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getParts,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    downtimeStatus: {
      type: "string[]",
      label: "Downtime Status",
      description: "The ID of the asset downtime status. If set, the result will only include assets with this asset downtime status.",
      optional: true,
      async options({ page }) {
        return await utils.asyncPropHandler({
          resourceFn: this.getDowntimeStatuses,
          page,
          labelVal: {
            label: "name",
            value: "id",
          },
        });
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.onupkeep.com/api/v2${path}`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _getHeaders(headers = {}) {
      return {
        "Session-Token": this._accessToken(),
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    async createWebhook({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    async deleteWebhook({
      webhookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    async getVendors({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/vendors",
        ...args,
      });
    },
    async getCategories({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/purchase-order-categories",
        ...args,
      });
    },
    async getPurchaseOrders({ ...args } = {}) {
      console.log("getPurchaseOrders", args);
      return this._makeRequest({
        method: "GET",
        path: "/purchase-orders",
        ...args,
      });
    },
    async getLocations({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/locations",
        ...args,
      });
    },
    async getAssets({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/assets",
        ...args,
      });
    },
    async getTeams({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/teams",
        ...args,
      });
    },
    async getUsers({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/users",
        ...args,
      });
    },
    async getParts({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/parts",
        ...args,
      });
    },
    async getDowntimeStatuses({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/asset-downtime-statuses",
        ...args,
      });
    },
    async getRequests({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/requests",
        ...args,
      });
    },
    async getWorkOrders({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/work-orders",
        ...args,
      });
    },
    async createPurchaseOrder({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/purchase-orders",
        ...args,
      });
    },
    async updatePurchaseOrder({
      purchaseOrderId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/purchase-orders/${purchaseOrderId}`,
        ...args,
      });
    },
    async createRequest({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/requests",
        ...args,
      });
    },
    async createWorkOrder({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/work-orders",
        ...args,
      });
    },
  },
};
