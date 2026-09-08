import { axios } from "@pipedream/platform";
import {
  API_KEY_HEADER,
  LIMIT_MIN,
  LIMIT_MAX,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "form_io",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The `_id` of the form. Run **List Forms** first to obtain valid form IDs.",
    },
    submissionId: {
      type: "string",
      label: "Submission ID",
      description: "The `_id` of the submission. Run **List Submissions** first to obtain valid submission IDs.",
    },
    roleId: {
      type: "string",
      label: "Role ID",
      description: "The `_id` of the role. Run **List Roles** first to obtain valid role IDs.",
    },
    actionId: {
      type: "string",
      label: "Action ID",
      description: "The `_id` of the form action. Run **List Form Actions** first to obtain valid action IDs.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of records to return. Min ${LIMIT_MIN}, max ${LIMIT_MAX}.`,
      optional: true,
      min: LIMIT_MIN,
      max: LIMIT_MAX,
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "Number of records to skip (for pagination).",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Field name to sort by; prefix with `-` for descending (e.g. `-created`, `title`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.project_id}.form.io`;
    },
    _headers() {
      return {
        [API_KEY_HEADER]: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      const url = `${this._baseUrl()}${path}`;
      return axios($, {
        url,
        headers: this._headers(),
        ...opts,
      });
    },
    // Forms
    async createForm({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/form",
        data,
      });
    },
    async getForm({
      $, formId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${formId}`,
      });
    },
    async updateForm({
      $, formId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${formId}`,
        data,
      });
    },
    async deleteForm({
      $, formId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${formId}`,
      });
    },
    async listForms({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/form",
        params,
      });
    },
    // Submissions
    async createSubmission({
      $, formId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/form/${formId}/submission`,
        data,
      });
    },
    async getSubmission({
      $, formId, submissionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${formId}/submission/${submissionId}`,
      });
    },
    async updateSubmission({
      $, formId, submissionId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${formId}/submission/${submissionId}`,
        data,
      });
    },
    async deleteSubmission({
      $, formId, submissionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${formId}/submission/${submissionId}`,
      });
    },
    async listSubmissions({
      $, formId, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${formId}/submission`,
        params,
      });
    },
    // Roles
    async createRole({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/role",
        data,
      });
    },
    async getRole({
      $, roleId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/role/${roleId}`,
      });
    },
    async updateRole({
      $, roleId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/role/${roleId}`,
        data,
      });
    },
    async deleteRole({
      $, roleId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/role/${roleId}`,
      });
    },
    async listRoles({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/role",
        params,
      });
    },
    // Form Actions
    async createFormAction({
      $, formId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/form/${formId}/action`,
        data,
      });
    },
    async getFormAction({
      $, formId, actionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${formId}/action/${actionId}`,
      });
    },
    async updateFormAction({
      $, formId, actionId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${formId}/action/${actionId}`,
        data,
      });
    },
    async deleteFormAction({
      $, formId, actionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${formId}/action/${actionId}`,
      });
    },
    async listFormActions({
      $, formId, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${formId}/action`,
        params,
      });
    },
  },
};
