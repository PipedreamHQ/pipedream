import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "xperiencify",
  propDefinitions: {
    courseId: {
      type: "integer",
      label: "Course",
      description: "Course",
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
    async _makeRequest({
      $ = this, method = "get", path, params, data, ...opts
    }) {
      try {
        return await axios($, {
          url: `https://api.xperiencify.io/api/public${path}`,
          method,
          params: {
            api_key: this.$auth.api_key,
            ...params,
          },
          data,
          ...opts,
        });
      } catch (e) {
        console.error(e.response.data);
        throw e;
      }
    },
    async listCourses() {
      return this._makeRequest({
        path: "/coach/courses",
      });
    },
    async addStudentToCourse({
      $, courseId, studentEmail, firstName, lastName, password, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/student/create",
        method: "post",
        data: {
          course_id: courseId,
          student_email: studentEmail,
          first_name: firstName,
          last_name: lastName,
          password,
        },
        ...opts,
      });
    },
    async getStudentsForCourse({ courseId }) {
      const courses = await this.listCourses();
      const [
        course,
      ] = courses.filter((course) => course.id === courseId);
      return course.users;
    },
  },
});
