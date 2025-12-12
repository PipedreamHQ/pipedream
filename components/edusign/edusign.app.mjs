import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "edusign",
  propDefinitions: {
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
      async options({ page }) {
        const { result: courses } = await this.listCourses({
          params: {
            page,
          },
        });
        return courses.map(({
          ID: value, NAME: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({ page }) {
        const { result: groups } = await this.listGroups({
          params: {
            page,
          },
        });
        return groups.map(({
          ID: value, NAME: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    studentId: {
      type: "string",
      label: "Student ID",
      description: "The ID of the student",
      async options({ page }) {
        const { result: students } = await this.listStudents({
          params: {
            page,
          },
        });
        return students.map(({
          ID: value, USERNAME: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    professorId: {
      type: "string",
      label: "Professor ID",
      description: "The ID of the professor",
      async options({ page }) {
        const { result: professors } = await this.listProfessors({
          params: {
            page,
          },
        });
        return professors.map(({
          ID: value, FIRSTNAME: firstName, LASTNAME: lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    classroomId: {
      type: "string",
      label: "Classroom ID",
      description: "The ID of the classroom",
      async options() {
        const { result: classrooms } = await this.listClassrooms();
        return classrooms.map(({
          ID: value, NAME: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://ext.edusign.fr";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        path: "/v1/course",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/v1/group",
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/v2/documents",
        ...opts,
      });
    },
    listStudents(opts = {}) {
      return this._makeRequest({
        path: "/v1/student",
        ...opts,
      });
    },
    listProfessors(opts = {}) {
      return this._makeRequest({
        path: "/v1/professor",
        ...opts,
      });
    },
    listClassrooms(opts = {}) {
      return this._makeRequest({
        path: "/v1/classrooms",
        ...opts,
      });
    },
    createCourse(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/course",
        ...opts,
      });
    },
    createGroup(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/group",
        ...opts,
      });
    },
    createStudent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/student",
        ...opts,
      });
    },
    addStudentToCourse({
      courseId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/course/attendance/${courseId}`,
        ...opts,
      });
    },
  },
};
