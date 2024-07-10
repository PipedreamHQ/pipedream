import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ispring_learn",
  propDefinitions: {
    courseIds: {
      type: "string[]",
      label: "Course ID",
      description: "The ID of the course.",
      async options({ prevContext }) {
        const {
          contentItems, nextPageToken,
        } = await this.listCourses({
          params: {
            pageSize: LIMIT,
            pageToken: prevContext.nextPage,
          },
        });

        return {
          options: contentItems.map(({
            contentItemId: value, title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextPage: nextPageToken,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
      async options({ prevContext }) {
        const {
          userProfiles, nextPageToken,
        } = await this.listUsers({
          params: {
            pageSize: LIMIT,
            pageToken: prevContext.nextPage,
          },
        });

        return {
          options: userProfiles.map(({
            userId: value, fields,
          }) => ({
            label: fields.filter(({ name }) => name === "EMAIL")[0].value,
            value,
          })),
          context: {
            nextPage: nextPageToken,
          },
        };
      },
    },
    departmentId: {
      type: "string",
      label: "Department Id",
      description: "The ID of the department the user belongs to.",
      async options({ prevContext }) {
        const {
          departments, nextPageToken,
        } = await this.listDepartments({
          params: {
            pageSize: LIMIT,
            pageToken: prevContext.nextPage,
          },
        });

        return {
          options: departments.map(({
            departmentId: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextPage: nextPageToken,
          },
        };
      },
    },
    groupId: {
      type: "string[]",
      label: "Group Id",
      description: "An array with the IDs of the groups the user will be added to.",
      async options({ prevContext }) {
        const {
          groups, nextPageToken,
        } = await this.listGroups({
          params: {
            pageSize: LIMIT,
            pageToken: prevContext.nextPage,
          },
        });

        return {
          options: groups.map(({
            groupId: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextPage: nextPageToken,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-learn.ispringlearn.com";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "X-Target-Locale": "en-US",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/contents",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/departments",
        ...opts,
      });
    },
    listUserEnrollments(opts = {}) {
      return this._makeRequest({
        path: "/enrollment",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/user/${userId}`,
        ...opts,
      });
    },
    enrollUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enrollment",
        ...opts,
      });
    },
    registerSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/register",
        ...opts,
      });
    },
    sendConfimationCode(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/code/send",
        ...opts,
      });
    },
    confirmCode(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/confirm",
        ...opts,
      });
    },
    subscribe(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/subscribe",
        ...opts,
      });
    },
    deleteSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/remove",
        ...opts,
      });
    },
  },
};
