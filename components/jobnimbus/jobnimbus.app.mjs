import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "jobnimbus",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "JNID of the contact.",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getContacts,
          page,
          params: {
            fields: "jnid,display_name",
          },
          resourceKey: "results",
          labelVal: {
            label: "display_name",
            value: "jnid",
          },
        });
      },
    },
    customerIdFromContacts: {
      type: "string",
      label: "Customer ID",
      description: "JNID of the customer. These options are fetched from contacts. There can be missing customers or duplicates. If missing, please provide the ID manually.",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getContacts,
          page,
          params: {
            fields: "customer,company",
          },
          resourceKey: "results",
          labelVal: {
            label: "company",
            value: "customer",
          },
        });
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address associated with the contact.",
    },
  },
  methods: {
    _getUrl(path) {
      return `https://app.jobnimbus.com/api1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getContact({
      contactId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    async getJob({
      jobId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async getActivities(args = {}) {
      return this._makeRequest({
        path: "/activities",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    async updateContact({
      contactId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
    async createAttachment(args = {}) {
      return this._makeRequest({
        path: "/files",
        method: "POST",
        ...args,
      });
    },
  },
};
