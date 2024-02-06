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
          mapper: ({
            display_name: label,
            jnid: value,
          }) => ({
            label,
            value,
          }),
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
          mapper: ({
            company: label,
            customer: value,
          }) => ({
            label,
            value,
          }),
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
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...args,
      };
      return axios($, config);
    },
    getContact({
      contactId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    getJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    getActivities(args = {}) {
      return this._makeRequest({
        path: "/activities",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "PUT",
        ...args,
      });
    },
    createAttachment(args = {}) {
      return this._makeRequest({
        path: "/files",
        method: "POST",
        ...args,
      });
    },
  },
};
