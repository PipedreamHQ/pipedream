import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  API_KEY_HEADER,
  LIMIT_MIN,
  LIMIT_MAX,
  FORM_TYPES,
  SUBMISSION_STATES,
  ACTION_HANDLERS,
  ACTION_METHODS,
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
    // Shared record fields. Components reference these via `propDefinition` and override
    // only what differs (description, optional, options) — see the per-component props.
    title: {
      type: "string",
      label: "Title",
      description: "A human-readable title.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The machine name (lowercase, no spaces).",
    },
    path: {
      type: "string",
      label: "Path",
      description: "The URL path.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The form type. One of `form` or `resource`.",
      optional: true,
      options: FORM_TYPES,
    },
    components: {
      type: "string",
      label: "Components",
      description: "JSON-string array of Form.io component schema objects.",
    },
    display: {
      type: "string",
      label: "Display",
      description: "How the form is displayed (e.g. `form`, `wizard`, `pdf`).",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the form.",
      optional: true,
    },
    settings: {
      type: "string",
      label: "Settings",
      description: "JSON-string object of settings. Parsed with JSON.parse() before sending.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description.",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "JSON-string object of the submission's data payload. Example: `{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\"}`. Parsed with JSON.parse() before sending.",
    },
    state: {
      type: "string",
      label: "State",
      description: "Submission state. One of `submitted` or `draft`.",
      optional: true,
      options: SUBMISSION_STATES,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Return only these top-level fields from each record. Omit to return the full objects.",
      optional: true,
    },
    handler: {
      type: "string[]",
      label: "Handler",
      description: "When the action runs. Values: `before`, `after`.",
      options: ACTION_HANDLERS,
    },
    method: {
      type: "string[]",
      label: "Method",
      description: "Which operations trigger the action. Values: `create`, `update`, `read`, `delete`, `index`.",
      options: ACTION_METHODS,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Execution priority of the action.",
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
    // Validate + URL-encode a required path id before it goes into a request URL.
    // An empty/whitespace id would otherwise build a malformed path (e.g. `/role/`),
    // which Form.io answers with an opaque HTML 404 instead of a usable error.
    _requireId(value, label) {
      const id = value == null
        ? ""
        : String(value).trim();
      if (!id) {
        throw new ConfigurationError(`The \`${label}\` prop is required and cannot be empty.`);
      }
      return encodeURIComponent(id);
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
        path: `/form/${this._requireId(formId, "formId")}`,
      });
    },
    async updateForm({
      $, formId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${this._requireId(formId, "formId")}`,
        data,
      });
    },
    async deleteForm({
      $, formId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${this._requireId(formId, "formId")}`,
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
        path: `/form/${this._requireId(formId, "formId")}/submission`,
        data,
      });
    },
    async getSubmission({
      $, formId, submissionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${this._requireId(formId, "formId")}/submission/${this._requireId(submissionId, "submissionId")}`,
      });
    },
    async updateSubmission({
      $, formId, submissionId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${this._requireId(formId, "formId")}/submission/${this._requireId(submissionId, "submissionId")}`,
        data,
      });
    },
    async deleteSubmission({
      $, formId, submissionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${this._requireId(formId, "formId")}/submission/${this._requireId(submissionId, "submissionId")}`,
      });
    },
    async listSubmissions({
      $, formId, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${this._requireId(formId, "formId")}/submission`,
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
        path: `/role/${this._requireId(roleId, "roleId")}`,
      });
    },
    async updateRole({
      $, roleId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/role/${this._requireId(roleId, "roleId")}`,
        data,
      });
    },
    async deleteRole({
      $, roleId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/role/${this._requireId(roleId, "roleId")}`,
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
        path: `/form/${this._requireId(formId, "formId")}/action`,
        data,
      });
    },
    async getFormAction({
      $, formId, actionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${this._requireId(formId, "formId")}/action/${this._requireId(actionId, "actionId")}`,
      });
    },
    async updateFormAction({
      $, formId, actionId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: `/form/${this._requireId(formId, "formId")}/action/${this._requireId(actionId, "actionId")}`,
        data,
      });
    },
    async deleteFormAction({
      $, formId, actionId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/form/${this._requireId(formId, "formId")}/action/${this._requireId(actionId, "actionId")}`,
      });
    },
    async listFormActions({
      $, formId, params,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/form/${this._requireId(formId, "formId")}/action`,
        params,
      });
    },
  },
};
