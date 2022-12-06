import { google } from "googleapis";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_classroom",
  propDefinitions: {
    course: {
      type: "string",
      label: "Course",
      description: "Identifier of the course",
      async options({
        prevContext, courseStates = [],
      }) {
        const { nextPageToken: pageToken } = prevContext;
        const {
          courses, nextPageToken,
        } = await this.listCourses({
          courseStates,
          pageToken,
        });
        const options = courses?.map((course) => ({
          label: course.name,
          value: course.id,
        })) || [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    coursework: {
      type: "string",
      label: "Assignment",
      description: "Identifier of the course work/assignment",
      async options({
        prevContext, courseId, courseWorkStates = [],
      }) {
        const { nextPageToken: pageToken } = prevContext;
        const {
          courseWork, nextPageToken,
        } = await this.listCoursework({
          courseId,
          courseWorkStates,
          pageToken,
        });
        const options = courseWork?.map((assignment) => ({
          label: assignment.title,
          value: assignment.id,
        })) || [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    courseStates: {
      type: "string[]",
      label: "Course States",
      description: "Restricts returned courses to those in one of the specified states",
      options: constants.COURSE_STATE_OPTIONS,
      optional: true,
    },
    courseworkStates: {
      type: "string[]",
      label: "Assignment States",
      description: "Restriction on the work status to return",
      options: constants.COURSEWORK_STATE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _client() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.classroom({
        version: "v1",
        auth,
      });
    },
    async listCourses(params = {}) {
      const classroom = this._client();
      const { data } = await classroom.courses.list(params);
      return data;
    },
    async listCoursework(params = {}) {
      const classroom = this._client();
      const { data } = await classroom.courses.courseWork.list(params);
      return data;
    },
    async getCoursework(params = {}) {
      const classroom = this._client();
      const { data } = await classroom.courses.courseWork.get(params);
      return data;
    },
  },
};
