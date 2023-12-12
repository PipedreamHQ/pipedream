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
    student: {
      type: "string",
      label: "Student",
      description: "The student's email address",
      async options({ courseId }) {
        const students = !courseId
          ? await this.listAllStudents()
          : await this.getStudentsForCourse({
            courseId,
          });
        return students.map((student) => ({
          label: student.first_name,
          value: student.email,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Student tags",
      async options({ studentEmail }) {
        const tags = await this.listStudentTags({
          data: {
            student_email: studentEmail,
          },
        });
        return tags;
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      try {
        return await axios($, {
          url: `https://api.xperiencify.io/api/public${path}`,
          params: {
            api_key: this.$auth.api_key,
            ...params,
          },
          ...opts,
        });
      } catch (e) {
        console.error(e.response.data);
        throw e;
      }
    },
    async listCourses(opts = {}) {
      return this._makeRequest({
        path: "/coach/courses",
        ...opts,
      });
    },
    async listAllStudents() {
      const courses = await this.listCourses();
      const promises = courses.map(async (course) => this.getStudentsForCourse({
        courseId: course.id,
      }));
      return (await Promise.all(promises)).flat().sort();
    },
    async listStudentTags(opts = {}) {
      return this._makeRequest({
        path: "/student/tag/list",
        ...opts,
      });
    },
    async addTagsToStudent(opts = {}) {
      return this._makeRequest({
        path: "/student/tag/manager",
        method: "post",
        ...opts,
      });
    },
    async removeTagsFromStudent(opts = {}) {
      return this._makeRequest({
        path: "/student/tag/manager",
        method: "delete",
        ...opts,
      });
    },
    async removeStudentFromAllCourses(opts = {}) {
      return this._makeRequest({
        path: "/student/course/remove/all",
        method: "post", // yes, it's supposed to be post
        ...opts,
      });
    },
    async getStudentsForCourse({ courseId }) {
      const courses = await this.listCourses();
      const [
        course,
      ] = courses.filter((course) => course.id === courseId) || [];

      if (!course) {
        throw new Error(`Course ${courseId} not found`);
      }
      return course.users;
    },
    async addStudentToCourse(opts = {}) {
      return this._makeRequest({
        path: "/student/create",
        method: "post",
        ...opts,
      });
    },
    async removeStudentFromCourse(opts = {}) {
      return this._makeRequest({
        path: "/student/course/remove",
        method: "post", // yes, it's supposed to be post
        ...opts,
      });
    },
  },
});
