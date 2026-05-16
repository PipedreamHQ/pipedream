import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "read_ai",
  propDefinitions: {
    meetingId: {
      type: "string",
      label: "Meeting ID",
      description: "The ULID of the meeting. Use **List Meetings** to find a meeting ID.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of meetings to return. Maximum is 10.",
      default: 10,
      min: 1,
      max: 10,
    },
    cursor: {
      type: "string",
      label: "Pagination Cursor",
      description: "Cursor from a previous list response (`nextCursor`) to retrieve the next page of results.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.read.ai/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $, path, params, ...config
    }) {
      return axios($ || this, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        ...config,
      });
    },
    async listMeetings({
      $, startTimeMs, endTimeMs, limit, cursor, expand,
    }) {
      return this._makeRequest({
        $,
        path: "/meetings",
        params: {
          ...(startTimeMs && {
            "start_time_ms.gte": startTimeMs,
          }),
          ...(endTimeMs && {
            "start_time_ms.lte": endTimeMs,
          }),
          limit,
          cursor,
          ...(expand?.length && {
            "expand[]": expand,
          }),
        },
      });
    },
    async getMeeting({
      $, meetingId, expand,
    }) {
      const params = {};
      if (expand?.length) {
        params["expand[]"] = expand;
      }
      return this._makeRequest({
        $,
        path: `/meetings/${meetingId}`,
        params,
      });
    },
  },
};
