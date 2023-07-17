import { axios } from "@pipedream/platform";
import drive from "@googleapis/drive";

export default {
  type: "app",
  app: "google_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "Identifier of a Google Form",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const forms = await this.listForms({
          pageToken: nextPageToken,
        });
        const formOptions = forms?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options: formOptions,
          context: {
            nextPageToken,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the form which is visible to responders",
    },
    formResponseId: {
      type: "string",
      label: "Form Response",
      description: "The response ID within the form",
      async options({ formId }) {
        const { responses } = await this.listFormResponses({
          formId,
        });
        return responses?.map(({ responseId }) => responseId) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://forms.googleapis.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
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
    getForm({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}`,
        ...args,
      });
    },
    createForm(args = {}) {
      return this._makeRequest({
        path: "/forms",
        method: "POST",
        ...args,
      });
    },
    updateForm({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}:batchUpdate`,
        method: "POST",
        ...args,
      });
    },
    getFormResponse({
      formId, responseId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/responses/${responseId}`,
        ...args,
      });
    },
    listFormResponses({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/responses`,
        ...args,
      });
    },
    drive() {
      const auth = new drive.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      const version = "v3";
      return drive.drive({
        version,
        auth,
      });
    },
    async listForms(args = {}) {
      const drive = this.drive();
      const { data: { files } } = await drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.form'",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        ...args,
      });
      return files;
    },
  },
};
