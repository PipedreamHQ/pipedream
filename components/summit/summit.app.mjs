import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "summit",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the visitor",
      optional: true,
    },
    session_id: {
      type: "string",
      label: "Session ID",
      description: "The ID of the session",
    },
    session_start: {
      type: "string",
      label: "Session Start",
      description: "The start time of the session",
      optional: true,
    },
    session_end: {
      type: "string",
      label: "Session End",
      description: "The end time of the session",
      optional: true,
    },
    simulation_id: {
      type: "string",
      label: "Simulation ID",
      description: "The ID of the simulation",
    },
    simulation_start: {
      type: "string",
      label: "Simulation Start",
      description: "The start time of the simulation",
      optional: true,
    },
    simulation_end: {
      type: "string",
      label: "Simulation End",
      description: "The end time of the simulation",
      optional: true,
    },
    model_name: {
      type: "string",
      label: "Model Name",
      description: "The name of the model to be run",
    },
    field_name: {
      type: "string",
      label: "Field Name",
      description: "The name of the response field to be captured",
      optional: true,
    },
    first_name: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    last_name: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      optional: true,
    },
    phone_number: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.summit.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitVisitorEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/visitorEvents",
        data: opts,
      });
    },
    async emitSessionEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sessionEvents",
        data: opts,
      });
    },
    async emitSimulationEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/simulationEvents",
        data: opts,
      });
    },
    async executeModel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/executeModel",
        data: opts,
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: opts,
      });
    },
  },
};
