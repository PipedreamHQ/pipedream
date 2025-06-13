import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hunter",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name from which you want to find the email addresses. For example, 'stripe.com'.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company name from which you want to find the email addresses. For example, 'stripe'.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Get only personal or generic email addresses.",
      options: [
        "personal",
        "generic",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address you want to verify or find information about.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Specifies the max number of email addresses to return. The default is `100`.",
      default: 100,
      min: 1,
      max: 100,
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The unique identifier of the lead.",
      async options({ prevContext: { offset = 0 } }) {
        const DEFAULT_LIMIT = 100;
        if (offset === null) {
          return [];
        }
        const { data: { leads } } = await this.listLeads({
          params: {
            limit: DEFAULT_LIMIT,
            offset,
          },
        });
        const options = leads.map(({
          id: value,
          email: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            offset: leads.length === DEFAULT_LIMIT
              ? offset + DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    position: {
      type: "string",
      label: "Position",
      description: "The person's position in the company.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website URL of the company.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The person's phone number.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry of the company.",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code (ISO 3166-1 alpha-2 standard).",
      optional: true,
    },
    companySize: {
      type: "string",
      label: "Company Size",
      description: "The size of the company.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the lead.",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "The Twitter handle.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL.",
      optional: true,
    },
    leadsListId: {
      type: "string",
      label: "Leads List ID",
      description: "Only returns the leads belonging to this list.",
      async options({ prevContext: { offset = 0 } }) {
        const DEFAULT_LIMIT = 100;
        if (offset === null) {
          return [];
        }
        const { data: { leads_lists: leadsLists } } = await this.listLeadsLists({
          params: {
            limit: DEFAULT_LIMIT,
            offset,
          },
        });
        const options = leadsLists.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            offset: leadsLists.length === DEFAULT_LIMIT
              ? offset + DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.hunter.io/v2${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-API-KEY": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    put(args = {}) {
      return this._makeRequest({
        ...args,
        method: "PUT",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
    domainSearch(args = {}) {
      return this._makeRequest({
        path: "/domain-search",
        ...args,
      });
    },
    emailFinder(args = {}) {
      return this._makeRequest({
        path: "/email-finder",
        ...args,
      });
    },
    emailVerifier(args = {}) {
      return this._makeRequest({
        path: "/email-verifier",
        ...args,
      });
    },
    combinedEnrichment(args = {}) {
      return this._makeRequest({
        path: "/combined/find",
        ...args,
      });
    },
    emailCount(args = {}) {
      return this._makeRequest({
        path: "/email-count",
        ...args,
      });
    },
    accountInformation(args = {}) {
      return this._makeRequest({
        path: "/account",
        ...args,
      });
    },
    listLeadsLists(args = {}) {
      return this._makeRequest({
        path: "/leads_lists",
        ...args,
      });
    },
    getLeadsList({
      leadsListId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/leads_lists/${leadsListId}`,
        ...args,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "/leads",
        ...args,
      });
    },
    getLead({
      leadId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        ...args,
      });
    },
    createLead(args = {}) {
      return this.post({
        path: "/leads",
        ...args,
      });
    },
    updateLead({
      leadId, ...args
    } = {}) {
      return this.put({
        path: `/leads/${leadId}`,
        ...args,
      });
    },
    deleteLead({
      leadId, ...args
    } = {}) {
      return this.delete({
        path: `/leads/${leadId}`,
        ...args,
      });
    },
  },
};
