import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acuity_scheduling",
  propDefinitions: {
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The starting time to block off (e.g., '2023-01-01T00:00:00Z').",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The ending time of the blocked off period (e.g., '2023-01-01T01:00:00Z').",
    },
    appointmentTypeId: {
      type: "string",
      label: "Appointment Type ID",
      description: "Show only appointments of this type.",
      async options() {
        const data = await this.listAppointmentTypes();

        return data.filter((item) => item.active).map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "Show only appointments on calendar with specified ID.",
      async options() {
        const data = await this.listCalendars();

        return data.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://acuityscheduling.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listAppointmentTypes() {
      return this._makeRequest({
        path: "/appointment-types",
      });
    },
    listCalendars() {
      return this._makeRequest({
        path: "/calendars",
      });
    },
    listAppointments(opts = {}) {
      return this._makeRequest({
        path: "/appointments",
        ...opts,
      });
    },
    getAppointment({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/appointments/${id}`,
        ...opts,
      });
    },
    blockTime(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/blocks",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
