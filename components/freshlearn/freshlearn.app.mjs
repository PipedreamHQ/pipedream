import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshlearn",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member",
    },
    courseId: {
      type: "string",
      label: "Course ID",
      description: "The ID of the course",
    },
    productBundleId: {
      type: "string",
      label: "Product Bundle ID",
      description: "The ID of the product bundle",
    },
    memberDetails: {
      type: "object",
      label: "Member Details",
      description: "The details of the member to be updated or created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.freshlearn.com/v1/integration";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api-key": this.$auth.api_key,
        },
      });
    },
    async emitNewMemberEvent() {
      return this._makeRequest({
        path: "/member/new",
      });
    },
    async emitNewProductBundleEnrollmentEvent() {
      return this._makeRequest({
        path: "/member/enroll/productBundle",
      });
    },
    async emitNewCourseEnrollmentEvent() {
      return this._makeRequest({
        path: "/member/enroll/course",
      });
    },
    async createMember(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/member",
      });
    },
    async updateMember(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/member/${opts.memberId}`,
      });
    },
    async enrollMemberInCourse(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/member/${opts.memberId}/enroll/course/${opts.courseId}`,
      });
    },
  },
};
