import { axios } from "@pipedream/platform";
import methods from "./common/methods.mjs";

export default {
  type: "app",
  app: "drift",
  propDefinitions: {},
  methods: {
    ...methods,
    _mock$() {
      return new Proxy({}, {
        get() {
          return (...args) => console.log(...args);
        },
      });
    },
    _baseUrl() {
      return "https://driftapi.com";
    },

    _makeRequest({
      $ = this,
      path,
      method = "GET",
      contentType,
      ...opts
    }) {

      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth?.oauth_access_token || "iHlC8LmFQiTH0DcWds7ETMRMmo3BvUyP"}`,
          "Content-Type": contentType || "application/json",
        },
        ...opts,
      });
    },

    getNextPage($, url) {
      return axios($, {
        method: "GET",
        url,
        headers: {
          "Authorization": `Bearer ${this.$auth?.oauth_access_token || "iHlC8LmFQiTH0DcWds7ETMRMmo3BvUyP"}`,
        },
      });
    },

    getContactByEmail(opts) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },

    createContact(opts) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },

    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },

    getContactById({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },

    deleteContactById({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },

    async getContactByEmailOrId($, emailOrId) {

      let response;

      if (this.isIdNumber(Number(emailOrId))) {

        const contactId = Number(emailOrId);

        try {
          response = await this.getContactById({
            $,
            contactId,
          });
        } catch (error) {
          if (error.status === 404) {
            throw new Error(`No contact found with ID: ${contactId}`);
          } else {
            throw error;
          };
        }

      } else {
        const email = emailOrId;
        response = await this.getContactByEmail({
          $,
          params: {
            email,
          },
        });
        if (!response?.data?.length) {
          throw new Error(`No contact found with email: ${email}`);
        };
      };

      return response;
    },

    getNewestConversations(arr, lastKnown) {
      const firtsNew = arr.indexOf(lastKnown);
      if (firtsNew === -1) throw new Error("Id not found");
      const newest = arr.slice(0, firtsNew);
      return newest.reverse();
    },

  },
};
