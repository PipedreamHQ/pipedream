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
      description: "The numeric ID of the contact, as a string (e.g. `\"56031\"`). Run **List Contacts** first to obtain a valid contact ID — it is the `id` field on each returned contact (do NOT pass the contact's email here).",
    },
    contactWorkflowId: {
      type: "string",
      label: "Dossier ID (Contact Workflow ID)",
      description: "The numeric ID of the dossier (contact workflow), as a string (e.g. `\"88748\"`). Run **List Dossiers** for the relevant contact first to obtain a valid ID — it is the `id` field on each returned dossier.",
    },
    workflowId: {
      type: "integer",
      label: "Workflow ID",
      description: "The integer ID of the workflow template (e.g. `5740`). Run **List Templates** first to obtain a valid workflow ID — it is the numeric `id` on each returned template.",
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
      description: "Cursor for forward pagination — an opaque string returned by the API (e.g. `\"eyJpZCI6MTAwfQ==\"`). Pass the `meta.next_cursor` value from a previous response verbatim to fetch the next page. Leave empty to start from the first page.",
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
