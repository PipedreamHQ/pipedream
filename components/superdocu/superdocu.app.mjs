import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  API_VERSION_PATH,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  JSONAPI_TYPE_CONTACT,
  JSONAPI_TYPE_CONTACT_WORKFLOW,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "superdocu",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact. Run **List Contacts** first to obtain a valid contact ID.",
    },
    contactWorkflowId: {
      type: "string",
      label: "Dossier ID (Contact Workflow ID)",
      description: "The ID of the dossier (contact workflow). Run **List Dossiers** for the relevant contact first to obtain a valid ID.",
    },
    workflowId: {
      type: "integer",
      label: "Workflow ID",
      description: "The integer ID of the workflow template. Run **List Templates** first to obtain a valid workflow ID.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of records to return per page (min 1, max ${MAX_PER_PAGE}; the Superdocu API rejects values above ${MAX_PER_PAGE}). Defaults to ${DEFAULT_PER_PAGE}.`,
      optional: true,
      min: 1,
      max: MAX_PER_PAGE,
    },
    after: {
      type: "string",
      label: "After Cursor",
      description: "Cursor for forward pagination. Pass the `meta.next_cursor` value from a previous response to fetch the next page.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${BASE_URL}${API_VERSION_PATH}`;
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...opts,
      });
    },
    listTemplates({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/workflows",
        params,
      });
    },
    listContacts({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/contacts",
        params,
      });
    },
    createContact({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/contacts",
        data: {
          data: {
            type: JSONAPI_TYPE_CONTACT,
            attributes: data,
          },
        },
      });
    },
    listContactWorkflows({
      $, contactId, params,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/contacts/${contactId}/workflows`,
        params,
      });
    },
    createContactWorkflow({
      $, contactId, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/contacts/${contactId}/workflows`,
        data: {
          data: {
            type: JSONAPI_TYPE_CONTACT_WORKFLOW,
            attributes: data,
          },
        },
      });
    },
    getContactWorkflow({
      $, contactId, wid,
    } = {}) {
      return this._makeRequest({
        $,
        path: `/contacts/${contactId}/workflows/${wid}`,
      });
    },
    deleteContactWorkflow({
      $, contactId, wid,
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/contacts/${contactId}/workflows/${wid}`,
      });
    },
    inviteContact({
      $, contactId,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/contacts/${contactId}/invite`,
      });
    },
  },
};
