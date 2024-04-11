import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "acuity_scheduling",
  propDefinitions: {
    clientNameOrEmail: {
      type: "string",
      label: "Client Name or Email",
      description: "The client's name or email address to filter appointments.",
    },
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
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "Numeric ID of the calendar.",
      async options() {
        return this.listCalendars();
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://acuityscheduling.com/api/v1";
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
          "Authorization": `Basic ${Buffer.from(`${this.$auth.acuity_user_id}:${this.$auth.acuity_api_key}`).toString("base64")}`,
        },
      });
    },
    async listCalendars() {
      const response = await this._makeRequest({
        path: "/calendars",
      });
      return response.map((calendar) => ({
        label: calendar.name,
        value: calendar.id.toString(),
      }));
    },
    async getAppointments({ clientNameOrEmail }) {
      const params = new URLSearchParams();
      if (clientNameOrEmail.includes("@")) {
        params.append("email", clientNameOrEmail);
      } else {
        const [
          firstName,
          lastName,
        ] = clientNameOrEmail.split(" ");
        if (firstName) params.append("firstName", firstName);
        if (lastName) params.append("lastName", lastName);
      }
      return this._makeRequest({
        path: `/appointments?${params.toString()}`,
      });
    },
    async blockTime({
      startTime, endTime, calendarId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/blocks",
        data: {
          start: startTime,
          end: endTime,
          calendarID: calendarId,
        },
      });
    },
  },
};
