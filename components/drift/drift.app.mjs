import { axios } from "@pipedream/platform";
import methods from "./common/methods.mjs"

export default {
  type: "app",
  app: "drift",
  propDefinitions: {},
  methods: {
    ...methods,
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
      
      //console.log(opts);
      //return;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth?.oauth_access_token || "iHlC8LmFQiTH0DcWds7ETMRMmo3BvUyP"}`,
          "Content-Type": contentType || "application/json",
        },
        ...opts,
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
    

    updateContactById(contactId, opts) {
      const attributes = {
        name: opts.name,
        phone: opts.phone,
        ...opts.customAttributes,
      };
    
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data: { attributes },
      });
    },

    // 4. Fetch user information using an end-user ID
    getUserByEndUserId(endUserId) {
      return this._makeRequest({
        method: "GET",
        path: `/users/${endUserId}`,
      });
    },

    // 7. Delete a contact by ID
    deleteContactById(contactId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
      });
    },
    
  },
};
