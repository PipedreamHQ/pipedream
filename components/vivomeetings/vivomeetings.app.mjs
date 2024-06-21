import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vivomeetings",
  propDefinitions: {
    authorization: {
      type: "string",
      label: "Authorization",
      description: "Authorization token for VivoMeetings API",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the meeting or webinar",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time of the meeting or webinar in ISO 8601 format",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time of the meeting or webinar in ISO 8601 format",
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "List of attendee emails",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the meeting or webinar",
      optional: true,
    },
    conferenceId: {
      type: "string",
      label: "Conference ID",
      description: "ID of the conference or webinar",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.vivomeetings.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.authorization}`,
        },
      });
    },
    async createMeeting({
      title, startTime, endTime, attendees, description,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/meetings",
        data: {
          title,
          start_time: startTime,
          end_time: endTime,
          attendees,
          description,
        },
      });
    },
    async updateConference({
      conferenceId, title, startTime, endTime, attendees, description,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/conferences/${conferenceId}`,
        data: {
          title,
          start_time: startTime,
          end_time: endTime,
          attendees,
          description,
        },
      });
    },
    async fetchConference({ conferenceId }) {
      return this._makeRequest({
        method: "GET",
        path: `/conferences/${conferenceId}`,
      });
    },
    async emitNewEvent() {
      // Implement the logic to emit a new event when a new meeting or webinar is created.
      // This would typically involve setting up a webhook or polling the API for new events.
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
