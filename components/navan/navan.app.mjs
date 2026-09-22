import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "navan",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier (UUID) of the user",
      async options({ page }) {
        const { Resources } = await this.listUsers({
          params: {
            startIndex: page * constants.DEFAULT_LIMIT,
            count: constants.DEFAULT_LIMIT,
          },
        });
        return Resources?.map(({
          id: value, userName: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    userName: {
      type: "string",
      label: "Email",
      description: "User's email address",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "User's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "User's last name",
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "User status",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "User's job title",
      optional: true,
    },
    employeeNumber: {
      type: "string",
      label: "Employee Number",
      description: "Employee ID",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "Department name",
      optional: true,
    },
    costCenter: {
      type: "string",
      label: "Cost Center",
      description: "Cost center identifier",
      optional: true,
    },
    division: {
      type: "string",
      label: "Division",
      description: "Subsidiary in Navan",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "Geographic region",
      optional: true,
    },
    travelPolicy: {
      type: "string",
      label: "Travel Policy",
      description: "Travel policy assignment",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.api_url}${path}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: {
          "Authorization": `Bearer ${this.$auth.scim_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/Users",
        ...opts,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/Users/${userId}`,
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/Users/${userId}`,
        ...opts,
      });
    },
    replaceUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/Users/${userId}`,
        ...opts,
      });
    },
  },
};
