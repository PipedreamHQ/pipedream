import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "small_improvements",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The ID of the meeting.",
      async options({ participantId }) {
        const data = await this.listMeetings({
          params: {
            participants: participantId,
          },
        });

        return data.map(({
          id: value, title,
        }) => ({
          label: title || value,
          value,
        }));
      },
    },
    participantId: {
      type: "string",
      label: "Participant ID",
      description: "The ID of the participant in the meeting.",
      async options() {
        const data = await this.listAllUsers({
          params: {
            includeGuests: true,
            showLocked: true,
          },
        });

        return data.map(({
          id: value, name, email,
        }) => ({
          label: `${name} (${email})`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.small-improvements.com/api/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
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
    createMeetingNotes({
      meetingId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/meetings/${meetingId}/notes`,
        ...opts,
      });
    },
    listAllUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listMeetings(opts = {}) {
      return this._makeRequest({
        path: "/meetings",
        ...opts,
      });
    },
  },
};
