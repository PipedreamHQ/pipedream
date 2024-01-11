import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "intellihr",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The unique identifier for a person in intellihr",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of a person in intellihr",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of a person in intellihr",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of a person in intellihr",
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department of a person in intellihr",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "The position of a person in intellihr",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of a person in intellihr",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.intellihr.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createPerson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people",
        ...opts,
      });
    },
    async updatePerson(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/people/${opts.personId}`,
        ...opts,
      });
    },
    async searchPerson(opts = {}) {
      return this._makeRequest({
        path: "/people/search",
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
