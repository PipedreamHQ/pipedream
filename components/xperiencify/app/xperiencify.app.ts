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
          studentEmail,
        });
        return tags;
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
    async listAllStudents() {
      const courses = await this.listCourses();
      const promises = courses.map(async (course) => this.getStudentsForCourse({
        courseId: course.id,
      }));
      return (await Promise.all(promises)).flat();
    },
    async listStudentTags({
      $, studentEmail,
    }) {
      return this._makeRequest({
        $,
        path: "/student/tag/list",
        data: {
          student_email: studentEmail,
        },
      });
    },
    async addTagsToStudent({
      $, studentEmail, tags,
    }) {
      return this._makeRequest({
        $,
        path: "/student/tag/manager",
        method: "post",
        data: {
          student_email: studentEmail,
          tagname: tags,
        },
      });
    },
    async removeTagsFromStudent({
      $, studentEmail, tags,
    }) {
      return this._makeRequest({
        $,
        path: "/student/tag/manager",
        method: "delete",
        data: {
          student_email: studentEmail,
          tagname: tags,
        },
      });
    },
    async removeStudentFromAllCourses({
      $, studentEmail,
    }) {
      return this._makeRequest({
        $,
        path: "/student/course/remove/all",
        method: "post",
        data: {
          student_email: studentEmail,
        },
      });
    },
    async getStudentsForCourse({ courseId }) {
      const courses = await this.listCourses();
      const [
        course,
      ] = courses.filter((course) => course.id === courseId);
      return course.users;
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
    async removeStudentFromCourse({
      $, courseId, studentEmail,
    }) {
      return this._makeRequest({
        $,
        path: "/student/course/remove",
        method: "post",
        data: {
          course_id: courseId,
          student_email: studentEmail,
        },
      });
    },
  },
});
