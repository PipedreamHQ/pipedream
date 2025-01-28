import { axios } from "@pipedream/platform";
import contants from "./common/contants.mjs";

export default {
  type: "app",
  app: "gainsight_px",
  propDefinitions: {
    id: {
      type: "string",
      label: "ID",
      description: "Unique identifier for the account",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name associated with the account",
    },
    propertyKeys: {
      type: "string[]",
      label: "Property Keys",
      description: "At least one tag key. The key can be found by clicking on `Administration` >`Set Up` > `Products` > Tag Key. For example: AP-xxx-1",
    },
    countryName: {
      type: "string",
      label: "County Name",
      description: "Name of the country associated with the account",
      optional: true,
    },
    stateName: {
      type: "string",
      label: "State Name",
      description: "Name of the State associated with the account",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City associated with the account",
      optional: true,
    },
    identifyId: {
      type: "string",
      label: "Identify ID",
      description: "Identifier of the user",
      async options() {
        const response = await this.listUsers();
        const userIds = response.users;
        return userIds.map(({
          identifyId, email,
        }) => ({
          label: email,
          value: identifyId,
        }));
      },
    },
    type: {
      type: "string",
      label: "User Type",
      description: "Type of the user",
      options: contants.USER_TYPES,
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the user",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First Name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last Name of the user",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.base_endpoint;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-APTRINSIC-API-KEY": `${this.$auth.api_key}`,
          "Accept": "application/json",
        },
      });
    },
    async createAccount(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        method: "post",
        ...args,
      });
    },
    async deleteUser(args = {}) {
      return this._makeRequest({
        path: "/users/delete",
        method: "delete",
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "post",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
  },
};
