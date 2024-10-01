import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpspot",
  propDefinitions: {
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query to search for requests",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The ID of the request to update",
    },
    xRequestId: {
      type: "string",
      label: "XRequest ID",
      description: "The XRequest ID needed to identify the specific request that needs to be updated",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user. Required if no other identification details are provided",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user. Required if no other identification details are provided",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID of the user. Required if no other identification details are provided",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user. Required if no other identification details are provided",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the user. Required if no other identification details are provided",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "The note content for the request",
    },
    accessKey: {
      type: "string",
      label: "Access Key",
      description: "The access key for the specific request",
    },
  },
  methods: {
    _baseUrl() {
      return "https://yourdomain.helpspot.com/api/index.php";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
        },
      });
    },
    async createRequest({
      note, firstName, lastName, userId, email, phone,
    }) {
      const params = new URLSearchParams();
      params.append("method", "request.create");
      params.append("tNote", note);
      if (firstName) params.append("sFirstName", firstName);
      if (lastName) params.append("sLastName", lastName);
      if (userId) params.append("sUserId", userId);
      if (email) params.append("sEmail", email);
      if (phone) params.append("sPhone", phone);
      return this._makeRequest({
        method: "POST",
        data: params,
      });
    },
    async updateRequest({
      xRequestId, note,
    }) {
      const params = new URLSearchParams();
      params.append("method", "request.update");
      params.append("accesskey", xRequestId);
      params.append("tNote", note);
      return this._makeRequest({
        method: "POST",
        data: params,
      });
    },
    async searchRequests({ searchQuery }) {
      const params = new URLSearchParams();
      params.append("method", "request.search");
      params.append("query", searchQuery);
      return this._makeRequest({
        method: "POST",
        data: params,
      });
    },
    async getRequest({ requestId }) {
      const params = new URLSearchParams();
      params.append("method", "request.get");
      params.append("accesskey", requestId);
      return this._makeRequest({
        method: "GET",
        params,
      });
    },
    async emitNewRequest() {
      // Implementation to poll for new requests or subscribe to webhooks if supported.
    },
    async emitUpdatedRequest({ requestId }) {
      // Implementation to poll for updated requests or subscribe to webhooks if supported.
    },
  },
};
