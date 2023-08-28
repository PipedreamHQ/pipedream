import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teachable",
  propDefinitions: {
    studentId: {
      type: "string",
      label: "Student",
      description: "Identifier of a student",
      async options({ page }) {
        const params = {
          page: page + 1,
        };
        const { users } = await this.listUsers({
          params,
        });
        return users?.map(({
          id: value, name, email,
        }) => ({
          value,
          label: name || email,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the student",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the student",
      optional: true,
    },
    src: {
      type: "string",
      label: "SRC",
      description: "The signup source of the user, Information tab of the user profile. SRC can also be used as a custom value when creating users in your school. For example, if you use any unique identifiers to help manage your users in multiple external systems (such as unique IDs, tags, etc.), you can use the src field to keep this identifier associated with your user in Teachable.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://developers.teachable.com/v1";
    },
    _headers() {
      return {
        "apiKey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    createStudent(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    updateStudent({
      studentId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${studentId}`,
        method: "PATCH",
        ...args,
      });
    },
  },
};
