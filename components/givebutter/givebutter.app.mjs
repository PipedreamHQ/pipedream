// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  DEFAULT_PER_PAGE, MAX_PER_PAGE,
} from "./common/constants.mjs";

const BASE_URL = "https://api.givebutter.com/v1";

export default {
  type: "app",
  app: "givebutter",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name (max 255 chars). Maps to the API `first_name` field.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name (max 255 chars). Maps to the API `last_name` field.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address. Example: `jane@example.com`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number. Example: `+15555550100`.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name (max 255 chars). Maps to the API `company_name` field.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "List of tag strings for the contact (max 64 tags). Example: `[\"vip\", \"newsletter\"]`.",
      optional: true,
    },
    contactType: {
      type: "string",
      label: "Type",
      description: "Contact type. For `company`, provide **Company Name** instead of first/last name.",
      options: [
        "individual",
        "company",
      ],
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-indexed page number for offset-based pagination (Givebutter default: 1).",
      min: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return per page (maps to \`per_page\`). Must be between 1 and ${MAX_PER_PAGE} (the Givebutter API caps \`per_page\` at ${MAX_PER_PAGE}). Defaults to the API default of ${DEFAULT_PER_PAGE} if omitted.`,
      min: 1,
      max: MAX_PER_PAGE,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        url: path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...args,
      });
    },
    listCampaigns({
      params, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/campaigns",
        params,
        ...args,
      });
    },
    listContacts({
      params, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/contacts",
        params,
        ...args,
      });
    },
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    getTransaction({
      transactionId, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/transactions/${transactionId}`,
        ...args,
      });
    },
    createContact({
      data, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data,
        ...args,
      });
    },
    updateContact({
      contactId, data, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data,
        ...args,
      });
    },
  },
};
