import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "goto_meeting",
  methods: {
    _baseUrl() {
      return "https://api.goto.com/meeting/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createScheduledMeeting(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/meetings",
        ...opts,
      });
    },
    listUpcomingMeetings(opts = {}) {
      return this._makeRequest({
        path: "/upcomingMeetings",
        ...opts,
      });
    },
  },
};
