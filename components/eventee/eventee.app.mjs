import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eventee",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.eventee.com/public/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    listParticipants(opts = {}) {
      return this._makeRequest({
        path: "/participants",
        ...opts,
      });
    },
    listRegistrations(opts = {}) {
      return this._makeRequest({
        path: "/registrations",
        ...opts,
      });
    },
    inviteAttendees(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/attendee/invite",
        ...opts,
      });
    },
  },
};
