import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mctime",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user. If provided clock will be assigned for this user. If not provided clock will be assigned to the user who is authenticated and who is making the API call.",
      optional: true,
      async options({ page }) {
        const { items } = await this.getUsers({
          params: {
            page: page + 1,
          },
        });
        const users = items[0].data.users;
        return users.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization for the clocking time entry",
      async options({ page }) {
        const { items } = await this.getOrganizations({
          params: {
            page: page + 1,
          },
        });
        const orgs = items[0].data.organizations;
        return orgs.map(({
          id: value, organizationName: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    timeType: {
      type: "string",
      label: "Time Type",
      description: "The type of the clocking time entry",
      options: constants.TIME_TYPE,
    },
  },
  methods: {
    _baseUrl() {
      return "https://mctime.com/api/v2/auth";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "API_KEY": this.$auth.api_key,
        },
      });
    },
    manipulateClockingTime(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clock",
        ...opts,
      });
    },
    getTimeEntries(opts = {}) {
      return this._makeRequest({
        path: "/times",
        ...opts,
      });
    },
    getUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    getOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
  },
};
