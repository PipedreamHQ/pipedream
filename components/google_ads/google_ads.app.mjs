import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  type: "app",
  app: "google_ads",
  version: "0.0.{{ts}}",
  propDefinitions: {
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email address of the contact to add to the customer list.",
    },
    userListId: {
      type: "string",
      label: "User List ID",
      description: "The ID of the user list to add the contact to.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://googleads.googleapis.com";
    },
    _hashSha256(value) {
      return crypto.createHash("sha256").update(value)
        .digest("hex");
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "developer-token": `${this.$auth.developer_token}`,
          "login-customer-id": `${this.$auth.client_customer_id}`,
        },
      });
    },
    async addContactToCustomerList({
      contactEmail, userListId,
    }) {
      const hashedEmail = this._hashSha256(contactEmail.trim().toLowerCase());
      const operations = {
        operations: [
          {
            create: {
              resource_name: `customers/${this.$auth.client_customer_id}/userLists/${userListId}`,
              crm_based_user_list: {
                upload_key_type: "CONTACT_INFO",
              },
              membership_life_span: 30,
              members: [
                {
                  hashed_email: hashedEmail,
                },
              ],
            },
          },
        ],
      };

      return this._makeRequest({
        method: "POST",
        path: `/v8/customers/${this.$auth.client_customer_id}/userLists:mutate`,
        headers: {
          "Content-Type": "application/json",
        },
        data: operations,
      });
    },
  },
};
