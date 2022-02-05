import axios from "axios";

export default {
  type: "app",
  app: "microsoft_outlook",
  propDefinitions: {
    recipients: {
      label: "Recipients",
      description: "Array of email addresses",
      type: "string[]",
      optional: false,
    },
    /*files: {	//FIXME Temporary commented until object arrays are supported
      label: "Files to attach",
      description: "Array of files to attach to the email",
      type: "object[]",
      optional: true,
      propDefinition: [this, "name", "mimetype", "path"],
    },*/
    subject: {
      label: "Subject",
      description: "Subject of the email",
      type: "string",
      optional: false,
    },
    content: {
      label: "Content",
      description: "Content of the email in text format",
      type: "string",
      optional: true,
    },
    name: {
      label: "File name",
      description: "Name of the file seen by the recipients",
      type: "string[]",	//FIXME Temporary array until the object arrays are supported
      optional: true,
    },
    mimetype: {
      label: "File mimetype",
      description: "[MIME type as defined by the IANA](https://www.iana.org/assignments/media-types/media-types.xhtml)",
      type: "string[]",	//FIXME Temporary array until the object arrays are supported
      optional: true,
    },
    path: {
      label: "File path",
      description: "Absolute path to the file",
      type: "string[]",	//FIXME Temporary array until the object arrays are supported
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
      return axios({
        method,
        url: this._getHost() + endpoint,
        headers: this._getHeaders(),
        data,
        params,
      });
    },
  },
};
