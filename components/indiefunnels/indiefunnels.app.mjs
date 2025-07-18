import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "indiefunnels",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the member to update",
      async options({ page }) {
        const { items } = await this.listMembers({
          params: {
            page,
          },
        });

        return items.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Contact ID of the member",
      async options({ page }) {
        const { items } = await this.listContacts({
          params: {
            limit: LIMIT,
            skip: LIMIT * page,
          },
        });

        return items.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    groups: {
      type: "string[]",
      label: "Member Groups",
      description: "Member group ID(s) to which the member belongs",
      async options() {
        const items = await this.listMemberGroups();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subscriberLists: {
      type: "string[]",
      label: "Subscriber Lists",
      description: "Array of subscriber list IDs (email marketing lists)",
      async options() {
        const items = await this.listSubscriberLists();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Private note for the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the contact",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact. 2-letter ISO code",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company the contact belongs to",
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "An object of custom properties, as defined in the CRM section in your website",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags to assign to the contact",
    },
    subscribed: {
      type: "boolean",
      label: "Subscribed",
      description: "Whether the contact is a subscriber or not (for email marketing purposes).",
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Member approval status",
    },
    billingPhone: {
      type: "string",
      label: "Billing Address Phone",
      description: "Billing address phone number",
    },
    billingCompanyName: {
      type: "string",
      label: "Billing Address Company",
      description: "Billing address company name",
    },
    billingCompanyId: {
      type: "string",
      label: "Billing Address Company ID",
      description: "Billing address company ID",
    },
    billingCountry: {
      type: "string",
      label: "Billing Address Country",
      description: "Billing address country. 2-letter ISO 3166 code",
    },
    billingState: {
      type: "string",
      label: "Billing Address State",
      description: "Billing address state",
    },
    billingCity: {
      type: "string",
      label: "Billing Address City",
      description: "Billing address city",
    },
    billingZipCode: {
      type: "string",
      label: "Billing Address Zip Code",
      description: "Billing address zip code",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address Line 1",
      description: "Billing address line 1",
    },
    billingAddress2: {
      type: "string",
      label: "Billing Address Line 2",
      description: "Billing address line 2",
    },
    shippingPhone: {
      type: "string",
      label: "Shipping Address Phone",
      description: "Shipping address phone number",
    },
    shippingCompanyName: {
      type: "string",
      label: "Shipping Address Company",
      description: "Shipping address company name",
    },
    shippingCompanyId: {
      type: "string",
      label: "Shipping Address Company ID",
      description: "Shipping address company ID",
    },
    shippingCountry: {
      type: "string",
      label: "Shipping Address Country",
      description: "Shipping address country. 2-letter ISO 3166 code",
    },
    shippingState: {
      type: "string",
      label: "Shipping Address State",
      description: "Shipping address state",
    },
    shippingCity: {
      type: "string",
      label: "Shipping Address City",
      description: "Shipping address city",
    },
    shippingZipCode: {
      type: "string",
      label: "Shipping Address Zip Code",
      description: "Shipping address zip code",
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address Line 1",
      description: "Shipping address line 1",
    },
    shippingAddress2: {
      type: "string",
      label: "Shipping Address Line 2",
      description: "Shipping address line 2",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/api/site`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    getContact({
      contactId,
      ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    listMemberGroups(opts = {}) {
      return this._makeRequest({
        path: "/member-groups",
        ...opts,
      });
    },
    listMembers(opts = {}) {
      return this._makeRequest({
        path: "/members",
        ...opts,
      });
    },
    listSubscriberLists(opts = {}) {
      return this._makeRequest({
        path: "/subscriber-lists",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createMember(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/members",
        ...opts,
      });
    },
    updateContact({
      contactId,
      ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    updateMember({
      memberId,
      ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/members/${memberId}`,
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
