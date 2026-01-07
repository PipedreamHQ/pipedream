import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "canvas",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of an account",
      async options() {
        const accounts = await this.listAccounts();
        return accounts?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) ?? [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of a user",
      async options({ accountId }) {
        const users = await this.listUsers({
          accountId,
        });
        return users?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) ?? [];
      },
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of a course",
      async options({ userId }) {
        const courses = await this.listCourses({
          userId,
        });
        return courses?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) ?? [];
      },
    },
    assignmentId: {
      type: "string",
      label: "Assignment ID",
      description: "The ID of an assignment",
      async options({
        userId, courseId,
      }) {
        const assignments = await this.listAssignments({
          userId,
          courseId,
        });
        return assignments?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/api/v1`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listUsers({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/users`,
        ...opts,
      });
    },
    listCourses({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}/courses`,
        ...opts,
      });
    },
    listAssignments({
      userId, courseId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}/courses/${courseId}/assignments`,
        ...opts,
      });
    },
    updateAssignment({
      courseId, assignmentId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/courses/${courseId}/assignments/${assignmentId}`,
        ...opts,
      });
    },
  },
};
