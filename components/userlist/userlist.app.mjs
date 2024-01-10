import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "userlist",
  propDefinitions: {
    user: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of a user",
    },
    company: {
      type: "string",
      label: "Company ID",
      description: "Unique identifier for a company",
    },
  },
  methods: {
    _baseUrl() {
      return "https://push.userlist.com";
    },
    _headers() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Push ${this.$auth.push_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    createOrReplaceCompany(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    establishOrModifyRelationship(opts = {}) {
      return this._makeRequest({
        path: "/relationships",
        ...opts,
      });
    },
    generateNewEvent(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
  },
};
