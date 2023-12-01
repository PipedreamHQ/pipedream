import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "userflow",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
      optional: true,
    },
    checklistId: {
      type: "string",
      label: "Checklist ID",
      description: "The unique identifier for the checklist.",
    },
    checklistTasks: {
      type: "string[]",
      label: "Checklist Tasks",
      description: "The tasks within the checklist.",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event to track.",
    },
    eventProperties: {
      type: "object",
      label: "Event Properties",
      description: "Properties of the event being tracked.",
      optional: true,
    },
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The unique identifier for the flow.",
    },
    goalStep: {
      type: "string",
      label: "Goal Step",
      description: "The step at which the flow is considered completed.",
      optional: true,
    },
    surveyQuestions: {
      type: "string[]",
      label: "Survey Questions",
      description: "Survey questions included in the flow.",
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The unique identifier for the group.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.userflow.com";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Userflow-Version": "2020-01-03",
          ...otherOpts.headers,
        },
      });
    },
    async createUserOrUpdate({
      userId, email, attributes, groups, memberships,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: {
          id: userId,
          email,
          attributes,
          groups,
          memberships,
        },
      });
    },
    async findUser({
      userId, email, groupId,
    }) {
      let queryParams = {};
      if (groupId) {
        queryParams.group_id = groupId;
      }
      return this._makeRequest({
        path: `/users/${userId || email}`,
        params: queryParams,
      });
    },
    async trackEvent({
      userId, eventName, eventProperties, groupId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events",
        data: {
          user_id: userId,
          group_id: groupId,
          name: eventName,
          attributes: eventProperties,
        },
      });
    },
    async deleteUser({ userId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/users/${userId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
