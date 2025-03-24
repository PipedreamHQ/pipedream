import { axios } from "@pipedream/platform";
import { GENDER_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "teach_n_go",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The prospect's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The prospect's surname.",
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The prospect's gender.",
      options: GENDER_OPTIONS,
    },
    dateOfBirth: {
      type: "string",
      label: "Date Of Birth",
      description: "The prospect's date of birth. **Format: YYYY-MM-DD**",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The prospect's email address.",
    },
    courses: {
      type: "integer[]",
      label: "Courses",
      description: "The student's course Ids.",
      async options() {
        const { data } = await this.listCourses();

        return data.map(({
          course_full_title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.teachngo.com";
    },
    _headers(headers = {}) {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createProspect(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/LeadsApi/add",
        ...opts,
      });
    },
    registerStudent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/student",
        ...opts,
      });
    },
    listCourses(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/globalApis/course_list",
        ...opts,
      });
    },
    listStudents(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/globalApis/student_list",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          next,
        } = await fn({
          params,
          ...opts,
        });

        for (const d of data) {
          yield d;
        }

        hasMore = next;

      } while (hasMore);
    },
  },
};
