import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import constants from "./common/constants";

export default defineApp({
  type: "app",
  app: "namely",
  propDefinitions: {
    userId: {
      label: "User ID",
      description: "The ID of the user",
      type: "string",
      async options({ page }) {
        const users = await this.getUsers({
          page: page + 1,
        });

        return users.map((user) => ({
          label: user.first_name + (user.last_name
            ? " " + user.last_name
            : ""),
          value: user.id,
        }));
      },
    },
    firstName: {
      label: "First Name",
      description: "The first name of the user",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the user",
      type: "string",
    },
    personalEmail: {
      label: "Personal Email",
      description: "The personal email of the user",
      type: "string",
    },
    workEmail: {
      label: "Work Email",
      description: "The work email of the user",
      type: "string",
    },
    userStatus: {
      label: "user Status",
      description: "The status of the user",
      type: "string",
      options: constants.USER_STATUSES,
      default: "active",
    },
    salaryAmount: {
      label: "Yearly Salary Amount",
      description: "The yearly salary amount of the user. E.g. `100000`",
      type: "integer",
      optional: true,
    },
    salaryCurrency: {
      label: "Salary Currency",
      description: "The currency of the salary. E.g. `USD`",
      type: "string",
      default: "USD",
      optional: true,
    },
  },
  methods: {
    _subdomain() {
      return this.$auth.subdomain;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.namely.com/api/v1`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async getUsers({
      $, page, perPage,
    }) {
      const response = await this._makeRequest({
        $,
        path: "profiles",
        params: {
          page: page ?? 1,
          per_page: perPage ?? 50,
        },
      });

      return response.profiles;
    },
    async getUser({
      $, userId,
    }) {
      const response = await this._makeRequest({
        $,
        path: `profiles/${userId}`,
      });

      return response;
    },
    async createUser({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "profiles",
        method: "post",
        data: {
          profiles: [
            data,
          ],
        },
      });
    },
    async updateUser({
      $, userId, data,
    }) {
      return this._makeRequest({
        $,
        path: `profiles/${userId}`,
        method: "put",
        data: {
          profiles: [
            data,
          ],
        },
      }, $);
    },
  },
});
