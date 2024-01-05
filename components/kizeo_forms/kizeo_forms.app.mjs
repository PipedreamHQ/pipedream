import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "kizeo_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form",
      async options() {
        const forms = await this.listForms();
        return forms.map((form) => ({
          label: this.getValueFromForm(form, "name"),
          value: this.getValueFromForm(form),
        }));
      },
    },
    action: {
      type: "string",
      label: "Action",
      description: "Name of the action",
    },
    format: {
      type: "string",
      label: "Format",
      description: "Either simple or basic. With simple the query returns only the first level of the data (the tables are not returned). With basic, the data is returned in full (the tables are included).",
      options: [
        "simple",
        "basic",
      ],
    },
    exportFormat: {
      type: "string",
      label: "Export Format",
      description: "Either csv or excel",
      options: [
        "csv",
        "excel",
      ],
    },
    dataId: {
      type: "string",
      label: "Data ID",
      description: "The ID of the data",
      async options({
        formId, action,
      }) {
        const data = await this.listUnreadFormData({
          formId,
          action,
        });
        return data.map(({ _id: value }) => value);
      },
    },
    exportId: {
      type: "string",
      label: "Export ID",
      description: "The ID of the export",
      async options({ formId }) {
        const exports = await this.listExports({
          formId,
        });
        return exports.map(({ _id: value }) => value);
      },
    },
  },
  methods: {
    getValueFromForm(resource, pattern = "id") {
      const [
        , value,
      ] = Object.entries(resource)
        .find(([
          key,
        ]) => key.includes(pattern));
      return value;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listForms(args = {}) {
      return this._makeRequest({
        path: "/forms",
        ...args,
      });
    },
    listUnreadFormData({
      formId, action, limit = 100, ...args
    } = {}) {
      return this.post({
        path: `/forms/${formId}/data/unread/${action}/${limit}`,
        ...args,
      });
    },
    markAsReadByAction({
      formId, action, ...args
    } = {}) {
      return this.post({
        path: `/forms/${formId}/markasreadbyaction/${action}`,
        ...args,
      });
    },
    listExports({
      formId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/forms/${formId}/exports`,
        ...args,
      });
    },
  },
};
