import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "howuku",
  propDefinitions: {
    eventToTrack: {
      type: "string",
      label: "Event to Track",
      description: "Specific event to track when a new incoming feedback is received",
    },
    surveyToTrack: {
      type: "string",
      label: "Survey to Track",
      description: "Specific survey to track when a new incoming survey is received",
    },
    visitorId: {
      type: "string",
      label: "Visitor ID",
      description: "Visitor ID to track when a new visitor session is recorded",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "Email of the new user to invite to join a team on howuku",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "ID of the team to which the user is invited. If not provided, default team will be used",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.howuku.com";
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
    async emitEvent(event, props) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${event}`,
        data: props,
      });
    },
    async inviteUser(email, teamId) {
      return this._makeRequest({
        method: "POST",
        path: `/teams/${teamId || "default"}/invitations`,
        data: {
          email,
        },
      });
    },
  },
};
