import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "gleap",
  propDefinitions: {
    name: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
    },
    data: {
      type: "object",
      label: "Event Data",
      description: "The data associated with the event.",
    },
    date: {
      type: "string",
      label: "Event Date",
      description: "The date of the event. Format `YYYY-MM-DDTHH:MM:SS.SSSZ`",
    },
    feedbackId: {
      type: "string",
      label: "feedback ID",
      description: "The unique identifier for the feedback",
      async options({ projectId }) {
        const { tickets } = await this.listFeedbacks({
          projectId,
        });

        return tickets.map(({
          shareToken: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user",
      async options({ projectId }) {
        const data = await this.listUsers({
          projectId,
        });

        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier for the project",
      async options() {
        const data = await this.listProjects();

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The name of the user",
      optional: true,
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email of the user",
      optional: true,
    },
    userValue: {
      type: "string",
      label: "User Value",
      description: "The value associated with the user",
      optional: true,
    },
    userPhone: {
      type: "string",
      label: "User Phone",
      description: "The phone number of the user",
      optional: true,
    },
    userCreatedAt: {
      type: "string",
      label: "User Created At",
      description: "The creation date of the user record",
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "Additional custom properties for the user",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gleap.io";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Api-Token": this.$auth.secret_api_token,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getFeedback({ feedbackId }) {
      return this._makeRequest({
        method: "GET",
        path: `/bugs/${feedbackId}`,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listUsers({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/users`,
        ...opts,
      });
    },
    trackEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/admin/track",
        ...opts,
      });
    },
    identifyUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/identify",
        data: {
          userId: opts.userId,
          name: opts.userName,
          email: opts.userEmail,
          value: opts.userValue,
          phone: opts.userPhone,
          createdAt: opts.userCreatedAt,
          ...opts.customProperties,
        },
      });
    },
    listFeedbacks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/projects/${projectId}/tickets`,
        ...opts,
      });
    },
    getFeedbacksOrderedByUpdatedAt() {
      return this._makeRequest({
        method: "GET",
        path: "/feedbacks",
        params: {
          orderBy: "-updatedAt",
        },
      });
    },
    deleteFeedback(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/feedbacks/${opts.feedbackId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.skip = LIMIT * page;
        page++;
        const { tickets } = await fn({
          params,
          ...opts,
        });
        for (const d of tickets) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = tickets.length;

      } while (hasMore);
    },
  },
};
