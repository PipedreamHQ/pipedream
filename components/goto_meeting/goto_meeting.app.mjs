import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "goto_meeting",
  version: "0.0.{{ts}}",
  propDefinitions: {
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the meeting",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the meeting in ISO 8601 format",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the meeting in ISO 8601 format",
    },
    passwordRequired: {
      type: "boolean",
      label: "Password Required",
      description: "Whether a password is required to join the meeting",
    },
    conferenceCallInfo: {
      type: "string",
      label: "Conference Call Info",
      description: "Information for the conference call",
    },
    meetingType: {
      type: "string",
      label: "Meeting Type",
      description: "The type of the meeting",
      options: [
        {
          label: "Scheduled",
          value: "scheduled",
        },
        {
          label: "Instant",
          value: "instant",
        },
        {
          label: "Recurring",
          value: "recurring",
        },
      ],
    },
    timezoneKey: {
      type: "string",
      label: "Timezone Key",
      description: "The timezone key for the meeting time",
      optional: true,
    },
    coorganizerKeys: {
      type: "string[]",
      label: "Co-Organizer Keys",
      description: "Keys of the co-organizers for the meeting",
      optional: true,
      async options() {
        const coorganizers = await this.listCoOrganizers();
        return coorganizers.map((coorganizer) => ({
          label: coorganizer.name,
          value: coorganizer.id,
        }));
      },
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.goto.com/meeting/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createScheduledMeeting({
      subject, startTime, endTime, passwordRequired, conferenceCallInfo, meetingType, timezoneKey, coorganizerKeys,
    }) {
      const data = {
        subject: this.subject,
        startTime: this.startTime,
        endTime: this.endTime,
        passwordRequired: this.passwordRequired,
        conferenceCallInfo: this.conferenceCallInfo,
        meetingType: this.meetingType,
      };
      if (this.timezoneKey) {
        data.timezoneKey = this.timezoneKey;
      }
      if (this.coorganizerKeys && this.coorganizerKeys.length > 0) {
        data.coorganizerKeys = this.coorganizerKeys;
      }
      const meeting = await this._makeRequest({
        method: "POST",
        path: "/meetings",
        data,
      });
      this.emitMeetingCreated(meeting);
      return meeting;
    },
    async listCoOrganizers() {
      return this._makeRequest({
        method: "GET",
        path: "/users/coorganizers",
      });
    },
    emitMeetingCreated(meeting) {
      this.$emit(meeting, {
        summary: `Meeting Created: ${meeting.subject}`,
        id: meeting.id,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (response && response.length > 0) {
          results.push(...response);
          page += 1;
        } else {
          hasMore = false;
        }
      }

      return results;
    },
  },
};
