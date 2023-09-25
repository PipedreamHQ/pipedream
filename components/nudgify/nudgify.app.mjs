import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nudgify",
  propDefinitions: {
    date: {
      type: "string",
      label: "Date",
      description:
        "The date (UTC) used to show in the Nudge how long ago the conversion took place. Format: `YYYY-MM-DD HH:MM:SS` (example: `2021-04-15 04:29:42`)",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user",
      optional: true,
    },
    ip: {
      type: "string",
      label: "IP Address",
      description: "The IP address of the user",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the user",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the user",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description:
        "The country of the user (max 2 characters, e.g. `GB`, `US`)",
      optional: true,
    },
  },
  methods: {
    async _makeRequest({
      $, path, headers, data, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `https://app.nudgify.com/api${path}`,
        headers: {
          ...headers,
          "Accept": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        data: {
          ...data,
          "site_key": `${this.$auth.site_key}`,
        },
      });
    },
    async createPurchaseNudge(args) {
      return this._makeRequest({
        method: "POST",
        path: "/purchases",
        ...args,
      });
    },
    async createSignUpNudge(args) {
      return this._makeRequest({
        method: "POST",
        path: "/conversions",
        ...args,
      });
    },
  },
};
