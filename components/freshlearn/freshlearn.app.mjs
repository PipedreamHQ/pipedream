import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshlearn",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the member",
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the member",
    },
    source: {
      type: "string",
      label: "Source",
      description: "Zapier/FreshLearn/etc",
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the member",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the member",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.freshlearn.com/v1/integration";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "api-key": `${this._apiKey()}`,
        },
      });
    },
    listMembers(args = {}) {
      return this._makeRequest({
        path: "/member",
        ...args,
      });
    },
    createMember(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/member",
        ...args,
      });
    },
    updateMember(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/member/update",
        ...args,
      });
    },
    enrollMemberInCourse(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/member/enroll",
        ...args,
      });
    },
  },
};
