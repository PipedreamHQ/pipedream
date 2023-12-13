import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "illumidesk",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
    },
    courseTitle: {
      type: "string",
      label: "Course Title",
      description: "The title of the course",
    },
    courseDescription: {
      type: "string",
      label: "Course Description",
      optional: true,
      description: "The description of the course",
    },
    courseDuration: {
      type: "integer",
      label: "Course Duration",
      optional: true,
      description: "The duration of the course in minutes",
    },
    memberEmail: {
      type: "string",
      label: "Member Email",
      description: "The email address of the member to be added",
    },
    campusId: {
      type: "string",
      label: "Campus ID",
      description: "The ID of the campus",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.illumidesk.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createCourseActivity({ courseId }) {
      return this._makeRequest({
        method: "POST",
        path: `/courses/${courseId}/activities`,
      });
    },
    async createCourseLesson({ courseId }) {
      return this._makeRequest({
        method: "POST",
        path: `/courses/${courseId}/lessons`,
      });
    },
    async addMemberToCourse({
      courseId, memberEmail,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/courses/${courseId}/members`,
        data: {
          email: memberEmail,
        },
      });
    },
    async createCourse({
      courseTitle, courseDescription, courseDuration,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/courses",
        data: {
          title: courseTitle,
          description: courseDescription,
          duration: courseDuration,
        },
      });
    },
    async inviteUserToCourse({
      courseId, memberEmail,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/courses/${courseId}/invitations`,
        data: {
          email: memberEmail,
        },
      });
    },
    async listCoursesByCampus({ campusId }) {
      return this._makeRequest({
        path: `/campuses/${campusId}/courses`,
      });
    },
  },
};
