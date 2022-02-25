import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_outlook",
  propDefinitions: {
    recipients: {
      label: "Recipients",
      description: "Array of email addresses",
      type: "string[]",
    },
    subject: {
      label: "Subject",
      description: "Subject of the email",
      type: "string",
    },
    content: {
      label: "Content",
      description: "Content of the email in text format",
      type: "string",
      optional: true,
    },
    name: {
      label: "File name",
      description: "Name of the file seen by the recipients (eg. `new_file_name.pdf`)",
      type: "string[]",
      optional: true,
    },
    mimetype: {
      label: "File mimetype",
      description: "[MIME type as defined by the IANA](https://www.iana.org/assignments/media-types/media-types.xhtml) (eg. `application/pdf`)",
      type: "string[]",
      optional: true,
    },
    path: {
      label: "File path",
      description: "Absolute path to the file  (eg. `/tmp/my_file.pdf`)",
      type: "string[]",
      optional: true,
    },
  },
  methods: {
    _getHost() {
      return "https://graph.microsoft.com/v1.0";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
        "Content-Type": "application/json",
      }
    },
    async _makeRequest(method, endpoint, data, params) {
      return axios(this, {
        method,
        url: this._getHost() + endpoint,
        headers: this._getHeaders(),
        data,
        params,
      });
    },
  },
};
