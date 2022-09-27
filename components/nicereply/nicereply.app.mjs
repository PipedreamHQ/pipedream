import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nicereply",
  propDefinitions: {
    surveyId: {
      label: "Survey ID",
      description: "The ID of the survey",
      type: "string",
      async options({ prevContext }) {
        const reqObj = {};

        if (prevContext.nextUrl) {
          reqObj.url = prevContext;
        }

        const response = await this.getSurveys(reqObj);

        return {
          options: response._results.map((survey) => ({
            label: survey.name,
            value: survey.id,
          })),
          context: {
            nextUrl: response?._pagination?.links?.next ?? null,
          },
        };
      },
    },
    customerId: {
      label: "Customer ID",
      description: "The ID of the customer",
      type: "string",
      async options({ prevContext }) {
        const reqObj = {};

        if (prevContext.nextUrl) {
          reqObj.url = prevContext;
        }

        const response = await this.getCustomers(reqObj);

        return {
          options: response._results.map((customer) => ({
            label: customer.name,
            value: customer.id,
          })),
          context: {
            nextUrl: response?._pagination?.links?.next ?? null,
          },
        };
      },
    },
    userId: {
      label: "User ID",
      description: "The ID of the user",
      type: "string",
      async options({ prevContext }) {
        const reqObj = {};

        if (prevContext.nextUrl) {
          reqObj.url = prevContext;
        }

        const response = await this.getUsers(reqObj);

        return {
          options: response._results.map((user) => ({
            label: user.name,
            value: user.id,
          })),
          context: {
            nextUrl: response?._pagination?.links?.next ?? null,
          },
        };
      },
    },
    teamId: {
      label: "Team ID",
      description: "The ID of the team",
      type: "string",
      async options({ prevContext }) {
        const reqObj = {};

        if (prevContext.nextUrl) {
          reqObj.url = prevContext;
        }

        const response = await this.getTeams(reqObj);

        return {
          options: response._results.map((team) => ({
            label: team.name,
            value: team.id,
          })),
          context: {
            nextUrl: response?._pagination?.links?.next ?? null,
          },
        };
      },
    },
  },
  methods: {
    _privateKey() {
      return this.$auth.private_key;
    },
    _apiUrl() {
      return "https://api.nicereply.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: "",
          password: this._privateKey(),
        },
        ...args,
      });
    },
    async getSurveys(args = {}) {
      return this._makeRequest({
        path: "/surveys",
        ...args,
      });
    },
    async getCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getTeams(args = {}) {
      return this._makeRequest({
        path: "/teams",
        ...args,
      });
    },
    async getSurveyRatings({
      surveyId, ...args
    }) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/ratings`,
        ...args,
      });
    },
    async getCustomerRatings({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `/customers/${customerId}/ratings`,
        ...args,
      });
    },
    async getUsersRatings({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}/ratings`,
        ...args,
      });
    },
    async getCSTARatings(args = {}) {
      return this._makeRequest({
        path: "/csat/ratings",
        ...args,
      });
    },
    async getCESRatings(args = {}) {
      return this._makeRequest({
        path: "/ces/ratings",
        ...args,
      });
    },
    async getNPSRatings(args = {}) {
      return this._makeRequest({
        path: "/nps/ratings",
        ...args,
      });
    },
  },
};
