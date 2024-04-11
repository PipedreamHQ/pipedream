import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thinkific",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email of the user",
    },
    courseBundleIds: {
      type: "string[]",
      label: "Course or Bundle IDs",
      description: "The IDs of the courses or bundles for enrollment",
    },
    userInfo: {
      type: "object",
      label: "User Information",
      description: "The information of the user to be created or updated",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thinkific.com/api/v2";
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
    async emitEvent(topic, data) {
      this.$emit(data, {
        summary: data.message,
        id: data.id,
        ts: Date.now(),
      });
    },
    async enrollUser(userId, userEmail, courseBundleIds) {
      const user = userId
        ? {
          id: userId,
        }
        : {
          email: userEmail,
        };
      const enrollments = courseBundleIds.map((id) => ({
        user,
        course: id,
      }));
      await this._makeRequest({
        method: "POST",
        path: "/enrollments",
        data: enrollments,
      });
    },
    async createUser(userInfo) {
      await this._makeRequest({
        method: "POST",
        path: "/users",
        data: userInfo,
      });
    },
    async updateUser(userId, userInfo) {
      await this._makeRequest({
        method: "PUT",
        path: `/users/${userId}`,
        data: userInfo,
      });
    },
    async emitNewPurchaseEvent() {
      await this.emitEvent("order.created", {});
    },
    async emitNewEnrollmentEvent() {
      await this.emitEvent("enrollment.completed", {});
    },
    async emitNewLessonCompletionEvent() {
      await this.emitEvent("lesson.completed", {});
    },
  },
};
