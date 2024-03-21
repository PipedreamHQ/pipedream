import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "better_stack",
  propDefinitions: {
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The unique identifier for the incident.",
      required: true,
    },
    incidentStatus: {
      type: "string",
      label: "Incident Status",
      description: "The status of the incident (optional).",
      optional: true,
    },
    timeOfIncident: {
      type: "string",
      label: "Time of Incident",
      description: "The time when the incident occurred (optional).",
      optional: true,
    },
    oldContactId: {
      type: "string",
      label: "Old Contact ID",
      description: "The ID of the old on-call contact.",
      required: true,
    },
    newContactId: {
      type: "string",
      label: "New Contact ID",
      description: "The ID of the new on-call contact.",
      required: true,
    },
    changeTime: {
      type: "string",
      label: "Change Time",
      description: "The time when the on-call contact changed (optional).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the incident.",
      required: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the incident.",
      required: true,
    },
    notificationSettings: {
      type: "object",
      label: "Notification Settings",
      description: "Additional notification settings (optional).",
      optional: true,
    },
    additionalDetails: {
      type: "object",
      label: "Additional Incident Details",
      description: "Additional details about the incident (optional).",
      optional: true,
    },
    resolutionDetails: {
      type: "object",
      label: "Resolution Details",
      description: "Details about the resolution of the incident (optional).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://uptime.betterstack.com/api/v2";
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
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.team_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createIncident({
      description, priority, notificationSettings, additionalDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/incidents",
        data: {
          description,
          priority,
          ...notificationSettings,
          ...additionalDetails,
        },
      });
    },
    async acknowledgeIncident({ incidentId }) {
      return this._makeRequest({
        method: "POST",
        path: `/incidents/${incidentId}/acknowledge`,
      });
    },
    async resolveIncident({
      incidentId, resolutionDetails,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/incidents/${incidentId}/resolve`,
        data: resolutionDetails,
      });
    },
  },
  version: "0.0.1",
};
