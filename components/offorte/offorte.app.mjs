import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "offorte",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ fieldId = "id" }) {
        const response = await this.listContacts();
        return response.map((item) => ({
          label: `${item.fullname || item.email}`,
          value: item[fieldId],
        }));
      },
    },
    organisationId: {
      type: "string",
      label: "Organisation ID",
      description: "The ID of the organisation",
      async options() {
        const response = await this.listOrganisations();
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the contact",
      async options() {
        const response = await this.listTags();
        return response.map(({ name }) => name);
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const response = await this.listUsers();
        return response.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    proposalTemplateId: {
      type: "string",
      label: "Proposal Template ID",
      description: "The ID of the proposal template",
      async options() {
        const response = await this.listProposalTemplates();
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    designTemplateId: {
      type: "string",
      label: "Design Template ID",
      description: "The ID of the design template",
      async options() {
        const response = await this.listDesignTemplates();
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    textTemplateId: {
      type: "string",
      label: "Text Template ID",
      description: "The ID of the text template",
      async options() {
        const response = await this.listTextTemplates();
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    proposalId: {
      type: "string",
      label: "Proposal ID",
      description: "The ID of the proposal",
      async options({ status }) {
        const response = await this.listProposals({
          status,
        });
        return response.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    emailTemplateId: {
      type: "string",
      label: "Email Template ID",
      description: "The ID of the email template",
      async options() {
        const response = await this.listEmailTemplates();
        return response.map(({
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
    street: {
      type: "string",
      label: "Street",
      description: "The street of the contact",
    },
    zipcode: {
      type: "string",
      label: "Zipcode",
      description: "The zipcode of the contact",
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
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    internet: {
      type: "string",
      label: "Internet",
      description: "The internet address of the contact",
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The LinkedIn address of the contact",
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "The Facebook address of the contact",
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The Twitter address of the contact",
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "The Instagram address of the contact",
    },
  },
  methods: {
    _headers() {
      return {
        "authorization": `${this.$auth.api_key}`,
      };
    },
    _baseUrl() {
      return `https://connect.offorte.com/api/v2/${this.$auth.account_name}`;
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
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/account/users",
        ...opts,
      });
    },
    createContactOrganisation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createContactPerson({
      organisationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${organisationId}/people`,
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/settings/tags",
        ...opts,
      });
    },
    listOrganisations(opts = {}) {
      return this._makeRequest({
        path: "/contacts/organisations",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/people",
        ...opts,
      });
    },
    getContactDetails({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    createProposal(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/proposals",
        ...opts,
      });
    },
    listDesignTemplates(opts = {}) {
      return this._makeRequest({
        path: "/settings/design-templates",
        ...opts,
      });
    },
    listTextTemplates(opts = {}) {
      return this._makeRequest({
        path: "/settings/text-templates",
        ...opts,
      });
    },
    listProposalTemplates(opts = {}) {
      return this._makeRequest({
        path: "/favorites/proposals",
        ...opts,
      });
    },
    listEmailTemplates(opts = {}) {
      return this._makeRequest({
        path: "/settings/email-templates",
        ...opts,
      });
    },
    listProposals({
      status, ...opts
    }) {
      return this._makeRequest({
        path: `/proposals/${status}/`,
        ...opts,
      });
    },
    sendProposal({
      proposalId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/proposals/${proposalId}/send`,
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
