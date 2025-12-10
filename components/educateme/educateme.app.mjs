import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "educateme",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of a course",
      async options() {
        const courses = await this.listCourses();
        return courses.map((course) => ({
          label: course.title,
          value: course.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "api-key": `${this.$auth.api_key}`,
        },
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/courses",
        ...opts,
      });
    },
    listCourseActivities({
      courseId, ...opts
    }) {
      return this._makeRequest({
        path: `/courses/${courseId}/lessons`,
        ...opts,
      });
    },
    createCourse(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/courses",
        ...opts,
      });
    },
  },
};
