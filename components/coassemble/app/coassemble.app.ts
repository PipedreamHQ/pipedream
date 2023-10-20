import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "coassemble",
  propDefinitions: {
    category: {
      type: "integer",
      label: "Category",
      description: "ID of category in which to create the new course.",
      async options() {
        const data = await this.listCategories();

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    studentId: {
      type: "integer",
      label: "Student Id",
      description: "ID of the User.",
      async options() {
        const data = await this.listStudents();

        return data.map(({
          id: value, username: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    courseId: {
      type: "string",
      label: "Course Id",
      description: "ID of the Course.",
      async options() {
        const data = await this.listCourses();

        return data.map(({
          id: value, title, code,
        }) => ({
          label: `${title} (${code})`,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.domain}.coassemble.com/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `COASSEMBLE-V1-SHA256 UserId=${this.$auth.user_id}, UserToken=${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createCourse(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "courses",
        method: "POST",
      });
    },
    createEnrolment(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "enrolments",
        method: "POST",
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "members",
        method: "POST",
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "categories",
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "courses",
      });
    },
    listEnrolments(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "enrolments",
      });
    },
    listStudents(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "students",
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "members",
      });
    },
    async *paginate({
      fn, maxResults = null,
    }) {
      let length = 0;
      let count = 0;
      let page = 0;

      do {
        const data = await fn({
          params: {
            page: page++,
            reverse: 1,
            sort: "created",
          },
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        length = data.length;
      } while (length);
    },
  },
});
