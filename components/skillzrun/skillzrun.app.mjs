import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "skillzrun",
  propDefinitions: {
    email: {
      type: "string",
      label: "User Email",
      description: "The email of the user. This is required and must be unique.",
    },
    name: {
      type: "string",
      label: "User Name",
      description: "The name of the user",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the user",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the user is active",
      optional: true,
    },
    seesAllSubjects: {
      type: "boolean",
      label: "Sees All Subjects",
      description: "Whether the user sees all offers",
      optional: true,
    },
    ignoreNotOpenLevels: {
      type: "boolean",
      label: "Ignore Not Open Levels",
      description: "Whether to ignore not open levels",
      optional: true,
    },
    ignoreStopItems: {
      type: "boolean",
      label: "Ignore Stop Items",
      description: "Whether to ignore stop items",
      optional: true,
    },
    noteAboutUser: {
      type: "string",
      label: "Note About User",
      description: "Additional information about the user",
      optional: true,
    },
    offerIds: {
      type: "integer[]",
      label: "Offer IDs",
      description: "The IDs of the associated offers.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.skillzrun.com/external/api";
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
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    upsertUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users/upsert",
        ...opts,
      });
    },
    createUserWithOffers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users/create-with-orders",
        ...opts,
      });
    },
  },
};
