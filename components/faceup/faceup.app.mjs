import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "faceup",
  propDefinitions: {
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "Unique identifier of the sender",
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "Unique identifier of the report",
    },
    reportType: {
      type: "string",
      label: "Report Type",
      description: "Type of the report",
      optional: true,
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "Unique identifier of the comment",
    },
    authorId: {
      type: "string",
      label: "Author ID",
      description: "Unique identifier of the comment's author",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.faceup.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitEvent(eventName, data) {
      this.$emit(data, {
        summary: `${eventName} created`,
        id: data.id,
      });
    },
    async createMessage(senderId) {
      const data = await this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          senderId,
        },
      });
      this.emitEvent("New Message", data);
    },
    async createReport(reportId, reportType = null) {
      const data = await this._makeRequest({
        method: "POST",
        path: "/reports",
        data: {
          reportId,
          reportType,
        },
      });
      this.emitEvent("New Report", data);
    },
    async createInternalComment(commentId, authorId) {
      const data = await this._makeRequest({
        method: "POST",
        path: "/internal_comments",
        data: {
          commentId,
          authorId,
        },
      });
      this.emitEvent("New Internal Comment", data);
    },
  },
};
