import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "plecto",
  propDefinitions: {
    dataSource: {
      type: "string",
      label: "Data Source",
      description: "ID of the data source of the registration",
      async options() {
        const response = await this.getDataSources();
        return response.map(({
          uuid, title,
        }) => ({
          value: uuid,
          label: title,
        }));
      },
    },
    member: {
      type: "string",
      label: "Member",
      description: "ID of the member associated with this registration",
      async options() {
        const response = await this.getMembers();
        return response.map(({
          uuid, name,
        }) => ({
          value: uuid,
          label: name,
        }));
      },
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "External ID to prevent duplicate registrations",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date and time of the registration in ISO 8601 format",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields representing the product information. For example. `{ \"Product Name\": \"Green tea\", \"Units Sold\": 2 }`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.plecto.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.password}`,
          ...auth,
        },
      });
    },

    async createRegistration(args = {}) {
      return this._makeRequest({
        path: "/registrations/",
        method: "post",
        ...args,
      });
    },
    async getDataSources(args = {}) {
      return this._makeRequest({
        path: "/datasources/",
        ...args,
      });
    },
    async getMembers(args = {}) {
      return this._makeRequest({
        path: "/members/",
        ...args,
      });
    },
  },
};
