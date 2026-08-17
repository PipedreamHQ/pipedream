// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import {
  AUTH_HEADER,
  BASE_URL,
  CAMPAIGNS_PATH,
  CONTACTS_PATH,
  TRANSACTIONS_PATH,
} from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "givebutter",
  propDefinitions: {},
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
          [AUTH_HEADER]: `Bearer ${this.$auth.api_key}`,
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
        path: CAMPAIGNS_PATH,
        params,
        ...args,
      });
    },
    listContacts({
      params, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: CONTACTS_PATH,
        params,
        ...args,
      });
    },
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: `${CONTACTS_PATH}/${contactId}`,
        ...args,
      });
    },
    getTransaction({
      transactionId, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: `${TRANSACTIONS_PATH}/${transactionId}`,
        ...args,
      });
    },
    createContact({
      data, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: CONTACTS_PATH,
        data,
        ...args,
      });
    },
    updateContact({
      contactId, data, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `${CONTACTS_PATH}/${contactId}`,
        data,
        ...args,
      });
    },
  },
};
