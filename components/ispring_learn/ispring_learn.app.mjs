import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ispring_learn",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course.",
    },
    materialId: {
      type: "string",
      label: "Material ID",
      description: "The ID of the material in a course.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
    },
    userRegistrationData: {
      type: "object",
      label: "User Registration Data",
      description: "The data required for registering a new user.",
    },
    userProfileData: {
      type: "object",
      label: "User Profile Data",
      description: "Additional profile data for the user.",
      optional: true,
    },
    fieldsToUpdate: {
      type: "object",
      label: "Fields to be Updated",
      description: "The fields to be updated for a specific user.",
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Filters to narrow down the results.",
    },
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "The IDs of the users.",
    },
    courseIds: {
      type: "string[]",
      label: "Course IDs",
      description: "The IDs of the courses.",
    },
    enrollmentDate: {
      type: "string",
      label: "Enrollment Date",
      description: "The date when the enrollment occurred.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-learn.ispringlearn.com";
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
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Auth-Account-Url": `https://${this.$auth.account_url}`,
          "X-Auth-Email": this.$auth.email,
          "X-Auth-Password": this.$auth.password,
          ...headers,
        },
      });
    },
    async registerUser({
      userRegistrationData, userProfileData = {},
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/register",
        data: {
          ...userRegistrationData,
          userProfileData,
        },
      });
    },
    async enrollUser({
      userIds, courseIds, enrollmentDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/enrollment",
        data: {
          learnerIds: userIds,
          courseIds: courseIds,
          accessDate: enrollmentDate || new Date().toISOString(),
        },
      });
    },
    async updateUser({
      userId, fieldsToUpdate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/user/${userId}`,
        data: fieldsToUpdate,
      });
    },
    async listUserEnrollments({ filters }) {
      return this._makeRequest({
        path: "/enrollment",
        params: filters,
      });
    },
    async listCourses({ filters }) {
      return this._makeRequest({
        path: "/contents",
        params: filters,
      });
    },
    async listUsers({ filters }) {
      return this._makeRequest({
        path: "/users",
        params: filters,
      });
    },
  },
};
