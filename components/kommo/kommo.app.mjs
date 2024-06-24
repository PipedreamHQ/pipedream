import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kommo",
  propDefinitions: {
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "Details of the lead to be created",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact related to the lead",
    },
    relatedCompanyDetails: {
      type: "object",
      label: "Related Company Details",
      description: "Details of the company related to the lead",
      optional: true,
    },
    relatedIndividualDetails: {
      type: "object",
      label: "Related Individual Details",
      description: "Details of the individual related to the lead",
      optional: true,
    },
    contactIdentifier: {
      type: "string",
      label: "Contact Identifier",
      description: "Identifier of the contact to be updated",
    },
    newContactDetails: {
      type: "object",
      label: "New Contact Details",
      description: "New details of the contact to be updated",
      optional: true,
    },
    searchKeyword: {
      type: "string",
      label: "Search Keyword",
      description: "Keyword to search for companies",
    },
    filterCriteria: {
      type: "object",
      label: "Filter Criteria",
      description: "Criteria to filter the search results",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.kommo.com/api/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createLead(opts = {}) {
      const {
        leadDetails, contactDetails, relatedCompanyDetails, relatedIndividualDetails, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/leads/complex",
        data: [
          {
            ...leadDetails,
            _embedded: {
              contacts: [
                contactDetails,
              ],
              companies: relatedCompanyDetails
                ? [
                  relatedCompanyDetails,
                ]
                : [],
              individuals: relatedIndividualDetails
                ? [
                  relatedIndividualDetails,
                ]
                : [],
            },
          },
        ],
        ...otherOpts,
      });
    },
    async updateContact(opts = {}) {
      const {
        contactIdentifier, newContactDetails, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "PATCH",
        path: `/contacts/${contactIdentifier}`,
        data: newContactDetails,
        ...otherOpts,
      });
    },
    async searchCompanies(opts = {}) {
      const {
        searchKeyword, filterCriteria, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: "/companies",
        params: {
          query: searchKeyword,
          ...filterCriteria,
        },
        ...otherOpts,
      });
    },
    async addWebhook(destination, events) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          destination,
          settings: events,
        },
      });
    },
  },
  async run({ $ }) {
    // Emit new event when a company is created
    await this.addWebhook("https://example.com/webhook/company", [
      "add_company",
    ]);
    // Emit new event when a lead is created
    await this.addWebhook("https://example.com/webhook/lead", [
      "add_lead",
    ]);
    // Emit new event when a contact is created
    await this.addWebhook("https://example.com/webhook/contact", [
      "add_contact",
    ]);
  },
};
